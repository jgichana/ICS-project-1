import express from "express"
import mysql from "mysql"

const app = express();

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "furnitureshop"
})

app.get("/product-listing", (req, res)=>{
    const q = "Select * from furniture_listing"
    db.query(q, (err, data)=>{
        if (err) return res.json(err)
            return res.json(data)
    })
})
app.listen(8000, ()=>{
    console.log("Connected to the backend")
})