import express from "express";
import con from "../utils/db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

router.post("/add_user", upload.single("image"), (req, res) => {
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
        req.body.status,
      ];
  
      con.query(sql, [values], (err, result) => {
        if (err)
          return res.json({ Status: false, Error: "error insertion: " + err });
        return res.json({ Status: true });
      });
    });
  });

  router.put("/update_user_status/:id", (req, res) => {
    const id = req.params.id;
    const update_status = req.body.update_status;
    const leave_date = req.body.leave_date;
  
    const sql = `update users set status = (?), leave_date = (?) WHERE user_id = (?)`;
  
    con.query(sql, [update_status, leave_date, id], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
    });

    const ItemSql = `update equipment set status = (?), leave_date = (?) WHERE employee_id = (?)
    AND status != 'available'`;

    con.query(ItemSql, [update_status, leave_date, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: err });
        return res.json({ Status: true });
      });
    
  });

  export {router as ApiRouts}