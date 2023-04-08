import configViewEngine from "./configs/viewEngine.js";
import express from "express";
import morgan from "morgan";
// const path = require("path");
import cors from "cors";

require("dotenv").config(); // package de dung bien global process.env
// console.log(process.env); // log o server side thoi (nhin terminal), khong co o console devtool tren browser dau

import initWebRoute from "./route/web.js";
import inintAPIRoute from "./route/api.js";
import connection from "./configs/connectDB.js";

const app = express(); // create instant app ( ke thua cac method cua express, nhu Class ES6+)
app.use(cors({ origin: true }));
const bodyParser = require("body-parser");

// Middleware morgan logging
// app.use(morgan("combined"));

const port = process.env.PORT || 9090;

// Cấu hình Express gửi POST request (gui data client len server va cta co the lay dc data 1 cach don gian)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Config View Engine EJS
configViewEngine(app);

// init web routes
initWebRoute(app);

// init api routes
inintAPIRoute(app);

// handle 404 not found (middleware level app)
app.use((req, res) => {
  return res.send("404.ejs");
});

app.listen(port, () => {
  console.log(`re-load server`);
  console.log(`Example app listening on port ${port}`);
});
