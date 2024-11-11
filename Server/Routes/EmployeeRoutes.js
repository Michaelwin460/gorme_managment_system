import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from 'multer'
import path from 'path'

const router = express.Router();


// router.post("/employeelogin", (req, res) => {
//     const sql = "SELECT * FROM users WHERE email = ?";
//     con.query(sql, [req.body.email], (err, result) => {
//       if (err)
//         return res.json({ loginStatus: false, Error: "Query error: " + err });
//       if (result.length > 0) {
//         bcrypt.compare(req.body.password, result[0].password, (err, response) => {
//           if(err) return res.json({Status: false, Error: "Wrong Password"});
//           const email = result[0].email;
//           const token = jwt.sign(
//             { role: "employee", email: email, id: result[0].id},
//             "g-food_secret_key",
//             { expiresIn: "1d" }
//           );
//           res.cookie("token", token);
//           return res.json({ loginStatus: true, id: result[0].id });
//         })
//       } 
//       else
//         return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
//     });
//   });

  router.get("/employee_details/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    con.query(sql, [id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    });
  });

  router.get("/logout", (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true});
  });



export { router as employeeRouter };