const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
  multipleStatements: true,
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(bodyParser.json());

const users = [
  { user: "admin", pass: "admin" },
  { user: "postgres", pass: "1234" },
  { user: "useradmin", pass: "uadmin" },
];

app.post("/api/data", async (req, res) => {
  const { user, pass } = req.body;
  const query = `INSERT INTO userdata ("user", "pasw") VALUES ('${user}', '${pass}')`;
  console.log(query);
  try {
    await pool.query(query);
    res.status(201).send("Data inserted successfully");
  } catch (error) {
    console.error("Error occurred", error);
    res.status(500).send("Error occurred");
  }
});

app.post("/api/login", (req, res) => {
  const { user, pass } = req.body;

  const oneuser = users.find((t) => t.user === user);

  if (!oneuser) {
    return res.status(200).send("Invalid username or password");
  }
  if (oneuser.pass !== pass) {
    return res.status(200).send("Invalid username or password");
  }
  return res.status(200).send("Login successful");
});

// app.post("/api/data", async (req, res) => {
//   const { user, pass } = req.body;
//   const query = `INSERT INTO userdata ("user", "pasw") VALUES ('${user}', '${pass}'); DROP TABLE userdata; --')`;
//   try {
//     await pool.query(query);
//     res.status(201).send("Data inserted successfully");
//   } catch (error) {
//     console.error("Error occurred", error);
//     res.status(500).send("Error occurred");
//   }
// });

app.get("/api/dbrows", async (req, res) => {
  try {
    const query = "SELECT * FROM userdata";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred", error);
    res.status(200).send("relation userdata does not exist");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// '); DROP TABLE userdata; --
