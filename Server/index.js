import express from "express";
import cors from 'cors'
import con from "./utils/db.js";
import { routes } from "./Routes/Routes.js";
import { ApiRouts } from "./Routes/ApiRouts.js";
// import { employeeRouter } from "./Routes/EmployeeRoutes.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import scheduleEmails from "./utils/auto-mailer.js";
import scheduledBackup from "./utils/backup.js"


const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', routes)
app.use('/api_v1', ApiRouts)
// app.use('/employee', employeeRouter)
app.use(express.static('Public'))

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token) {
        jwt.verify(token, "g-food_secret_key", (err ,decoded) => {
            if(err) return res.json({Status: false, Error: "Wrong Token"})
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({Status: false, Error: "Not autheticated"})
    }
};
app.get('/verify',verifyUser, (req, res)=> {
    return res.json({Status: true, role: req.role, id: req.id})
} );

const queryPromise = (sql, values) => {
  return new Promise((resolve, reject) => {
    con.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

app.post("/login", async (req, res) => {
  try {
    // Fetch user by email
    const sqlUser = "SELECT * FROM users WHERE email = ?";
    const userResult = await queryPromise(sqlUser, [req.body.email]);

    
    if (userResult.length === 0) {
      return res.json({ loginStatus: false, Error: "Wrong Email" });
    }
    
    const user = userResult[0];
    
    if(user.status == 'done'){
      return res.json({ loginStatus: false, Error: "User is out of the system" });
    }

    // Compare password using bcrypt
    const passwordMatch = await new Promise((resolve, reject) => {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!passwordMatch) {
      return res.json({ loginStatus: false, Error: "Wrong Password" });
    }

    // JWT token generation
    const token = jwt.sign(
      { role: user.role, email: user.email, id: user.user_id },
      "g-food_secret_key",
      { expiresIn: "1d" }
    );
    res.cookie("token", token);

    
    // If user is an itemCategoryAdmin, fetch the category
    let category = -1;
    let catName = '';
    if (user.role === "itemCategoryAdmin") {
      const sqlCategory = "SELECT * FROM equipment_category WHERE manager_email = ?";
      const categoryResult = await queryPromise(sqlCategory, [req.body.email]);

      if (categoryResult.length > 0) {
        category = categoryResult[0].id;
        catName = categoryResult[0].category_name;
      }
    }

        // If user is a department admin, fetch the department
        let department = -1;
        let depName = '';
        if (user.role === "departmentAdmin") {
          const sqlDepartment = "SELECT * FROM department WHERE manager_email = ?";
          const departmentResult = await queryPromise(sqlDepartment, [req.body.email]);
    
          if (departmentResult.length > 0) {
            department = departmentResult[0].id;
            depName = departmentResult[0].name;
          }
        }



    // Send the final response after all async operations are done
    return res.json({
      loginStatus: true,
      role: user.role,
      item_category_managment: category,
      category_name: catName,
      department_managment: department,
      department_name: depName,
      id: user.user_id,
      email: user.email
    });

  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ loginStatus: false, Error: "Server error: " + err });
  }
});

// app.post("/login", (req, res) => {
//     const sql = "SELECT * FROM users WHERE email = ?";
//     con.query(sql, [req.body.email], (err, result) => {
//       if (err) return res.json({ loginStatus: false, Error: "Query error: " + err });
//       if (result.length > 0) { 
//         // console.log(result[0]);
               
//         bcrypt.compare(req.body.password, result[0].password, (err, response) => {
//           if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
//           if (response) {
            
//             const token = jwt.sign(
//               { role: result[0].role, email: result[0].email, id: result[0].user_id },
//               "g-food_secret_key",
//               { expiresIn: "1d" }
//             );
//             res.cookie("token", token);

//             const category  = -1;
//             if(result[0].role === "itemCategoryAdmin")
//             {
//               const sql = "SELECT * FROM equipment_category WHERE email = ?";
//               con.query(sql, [req.body.email], (err, admin_result) => {
//                 if (err) return res.json({ loginStatus: false, Error: "Query error on importing category id managment: " + err });
//                 if(admin_result)
//                   category = admin_result[0].id;
//               });
//             }
//             return res.json({loginStatus: true, role: result[0].role, item_category_managment: category, id: result[0].user_id, email: result[0].email})
//           } else {
//             return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//           }
//         });
//       } else {
//         return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//       }
//     });
//   });

// app.post("/login", (req, res) => {
//     const sql = "SELECT * FROM users WHERE email = ?";
//     con.query(sql, [req.body.email], (err, result) => {
//       if (err) return res.json({ loginStatus: false, Error: "Query error: " + err });
//       if (result.length > 0) {
//         if (req.body.password === result[0].password) {  // Compare plain text passwords
//           const sent_role = result[0].role;
//           const token = jwt.sign(
//             { role: sent_role, email: result[0].email, id: result[0].user_id },
//             "g-food_secret_key",
//             { expiresIn: "1d" }
//           );
//           res.cookie("token", token);
//           return res.json({ loginStatus: true, role: sent_role, id: result[0].id });
//         } else {
//           return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//         }
//       } else {
//         return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//       }
//     });
//   });
  


scheduleEmails();
// sendManagerEmail('mwtr2559@gmail.com', 'Reminder: Users Equipment Return Check', emailContent);

scheduledBackup();

app.listen(3000, () => {
    console.log("Server is running")
})