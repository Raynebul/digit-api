import express from "express";
import user from "./routers/user.js";
import bodyParser from "body-parser"

const app = express(); // Express - parent server

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/user", user.router); // route /user

app.listen(3000);
