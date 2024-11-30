import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from 'multer'
import path from 'path'
import printer from 'pdf-to-printer'
import fs from 'fs'
import PDFDocument from "pdfkit";

const router = express.Router();

// image upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Public/Images')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})
// end imag eupload



//print function with multer

// router.post('/print-pdf', upload.single('file'), async (req, res) => {
//   const filePath = path.join(__dirname, req.file.path);
//   try {
//     await printer.print(filePath); // Send PDF to printer
//     fs.unlinkSync(filePath); // Clean up the uploaded file
//     res.status(200).send('Printed successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error printing');
//   }
// });

//end of print function


// router.post("/adminlogin", (req, res) => {
//   const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
//   con.query(sql, [req.body.email, req.body.password], (err, result) => {
//     if (err)
//       return res.json({ loginStatus: false, Error: "Query error: " + err });
//     if (result.length > 0) {
//       const email = result[0].email;
//       const token = jwt.sign(
//         { role: "admin", email: email, id: result[0].id },
//         "g-food_secret_key",
//         { expiresIn: "1d" }
//       );
//       res.cookie("token", token);
//       return res.json({ loginStatus: true });
//     } 
//     else
//       return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//   });
// });

router.post("/add_department", (req, res) => {
  const sql = "INSERT INTO department (`name`, `manager_name`, `manager_email`) VALUES (?)";
  console.log(req.body);
  const values = [
    req.body.name,
    req.body.manager_name,
    req.body.manager_email
  ]

  
  con.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
      
      return res.json({ Status: false, Error: "Query Error" })};
    return res.json({ Status: true });
  });
});

router.get("/department", (req, res) => {
  const sql = "SELECT * FROM department";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_equipment_category", (req, res) => {
  const sql = "INSERT INTO equipment_category (`category_name`, `manager_name`, `manager_email`) VALUES (?)";
  console.log(req.body);
  const values = [
    req.body.name,
    req.body.manager_name,
    req.body.manager_email
  ]

  
  con.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
      
      return res.json({ Status: false, Error: "Query Error" })};
    return res.json({ Status: true });
  });
});

router.get("/equipment_category", (req, res) => {
  const sql = "SELECT * FROM equipment_category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});


router.post("/add_user", upload.single('image'), (req, res) => {

    const sql = `
    INSERT INTO users (user_id, name, password, email, phone,  image, department_id,
    start_date, status) 
    VALUES (?)
    `;

    bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hash Error" });
    const values = [
      req.body.user_id,
      req.body.name,
      hash,
      req.body.email,
      req.body.phone,
      req.file.filename,
      req.body.department_id,
      // req.body.rol,
      req.body.start_date,
      req.body.status
    ];

    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: "error insertion: "+err });
      return res.json({ Status: true });
    });
  });
});

router.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/users/:id", (req, res) => {
  const id = req.params.id  
  const sql = `
    SELECT users.*, department.name as department_name
    FROM users
    LEFT JOIN department ON users.department_id = department.id
    WHERE users.user_id = ?
  `;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error "+ err  });

    return res.json({ Status: true, Result: result });
  });
});

router.get("/equipment/employee/:id", (req, res) => {
  const id = req.params.id
  // console.log(id);
  
  const sql = "SELECT * FROM equipment WHERE employee_id = (?)";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error "+ err  });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/equipment_by_category/:isEquipmentManager", (req, res) => {
  const category = parseInt(req.params.isEquipmentManager, 10); // Convert to number
  // console.log(category);

  let sql;
  if (category === -1) {
    sql = "SELECT * FROM equipment";
  } else {
    sql = "SELECT * FROM equipment WHERE item_category = ?";
  }

  con.query(sql, category === -1 ? [] : [category], (err, result) => { // Only pass parameter when needed
    if (err) return res.json({ Status: false, Error: "Query Error " + err });
    // console.log(result);
    return res.json({ Status: true, Result: result });
  });
});

router.get("/equipment_by_category_and_user/:isEquipmentManager", (req, res) => {
  const category = parseInt(req.params.isEquipmentManager, 10); // Convert to number
  // console.log(category);

  let sql;
  if (category === -1) {
    sql = `SELECT equipment.*, users.name, users.email, users.phone 
            FROM equipment
            JOIN users
            ON equipment.employee_id = users.user_id
            ` ;
  } else {
    sql = `SELECT equipment.*, users.name, users.email, users.phone 
            FROM equipment
            JOIN users
            ON equipment.employee_id = users.user_id
            WHERE equipment.item_category = (?)
            `;
  }

  con.query(sql, category === -1 ? [] : [category], (err, result) => { // Only pass parameter when needed
    if (err) return res.json({ Status: false, Error: "Query Error " + err });
    // console.log(result);
    return res.json({ Status: true, Result: result });
  });
});

router.post("/insert_new_item", (req, res) => {
  const sql = `
        INSERT INTO equipment (item_category, item_name, item_description, item_id, employee_id, start_date, status) 
        VALUES (?, ?, ?, ? ,? , ? ,?)
    `;

    // console.log(req);
    

    const values = [
      req.body.item_category,
      req.body.item_name,
      req.body.item_description,
      req.body.item_id,
      req.body.employee_id,
      req.body.start_date,
      req.body.status
  ];

  // for(let pair of values.entries())
  // console.log(pair[0] + " : " + pair[1]);

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });

});

router.post("/upload_item_file", upload.single("file"), (req, res) => {
  const { item_name } = req.body;
  if (!req.file || !item_name) {
    return res.status(400).json({ Status: false, Error: "Invalid data." });
  }

  // Save the file path and associated item_id to the database
  const file_name = req.file.filename;
  // console.log(file_name);
  
  const query = "UPDATE equipment SET file_name = ? WHERE item_name = ?";
  con.query(query, [file_name, item_name], (err, result) => {
    if (err) return res.status(500).json({ Status: false, Error: err.message });
    res.status(200).json({ Status: true, Message: "File uploaded successfully." });
  });
});

router.delete("/delete_equipment_by_employee/:id", (req, res) => {
  const id = req.params.id

  const sql = `delete from equipment WHERE employee_id = (?)`;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.delete("/delete_item/:id", (req, res) => {
  const id = req.params.id

  const sql = `delete from equipment WHERE item_id = (?)`;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.put("/update_user_status/:id", (req, res) => {
  const id = req.params.id;
  const update_status = req.body.update_status;
  const leave_date = req.body.leave_date;

  const sql = `update users set status = (?), leave_date = (?) WHERE user_id = (?)`;

  con.query(sql, [update_status, leave_date, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.put("/update_item_status/:id", (req, res) => {
  const id = req.params.id;
  const item_status = req.body.update_status;
  const leave_date = req.body.leave_date;

  const sql = `update equipment set status = (?), leave_date = (?) WHERE item_id = (?)`;

  con.query(sql, [item_status, leave_date, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.put("/update_all_items_status/:id", (req, res) => {
  const id = req.params.id;
  const item_status = req.body.update_status;
  const leave_date = req.body.leave_date;

  const sql = `update equipment set status = (?), leave_date = (?) WHERE employee_id = (?)`;

  con.query(sql, [item_status, leave_date, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.put("/update_user_leaving_date/:id", (req, res) => {
  const id = req.params.id;

  const leaving_date = req.body.leaving_date;

  const sql = `update users set leave_date = (?) WHERE user_id = (?) `;

  con.query(sql, [leaving_date, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.put("/update_user/:id", upload.single('image'), (req, res) => {

  const id = req.params.id
  
  const sql = `
        UPDATE users
        set user_id = ?, name = ?, password = ?, email = ?, phone = ?, image = ?, department_id = ?,
        start_date = ?, leave_date = ?
        WHERE user_id = (?)
    `;

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.json({ Status: false, Error: "Hash Error" });
      const values = [
        req.body.user_id,
        req.body.name,
        hash,
        req.body.email,
        req.body.phone,
        req.file ? req.file.filename : req.body.image,
        req.body.department_id,
        // req.body.rol,
        req.body.start_date,
        req.body.leave_date,
      ];
  
      con.query(sql, [...values, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "error update: "+err });
        return res.json({ Status: true });
      });
    });
});

router.delete("/delete_user/:id", (req, res) => {
  const id = req.params.id

  const sql = `delete from users WHERE user_id = (?)`;

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true });
  });
});

router.get("/count_tasks_count", (req, res) => {
  const sql = "SELECT COUNT(id) as tasks FROM equipment WHERE status = 'leaving' ";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Tasks: result[0].tasks });
  });
});

router.get("/count_leaving_users", (req, res) => {
  const sql = "SELECT COUNT(id) as users FROM users WHERE status = 'leaving' ";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// router.get("/admins", (req, res) => {
//   const sql = "SELECT * FROM admin";
//   con.query(sql, (err, result) => {
//     if (err) return res.json({ Status: false, Error: "Query Error" });
//     return res.json({ Status: true, Result: result });
//   });
// });


router.get("/logout", (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true});
});

export { router as routes };
