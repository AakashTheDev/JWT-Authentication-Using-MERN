const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
require("dotenv").config();
const UserModel = require("./Models/Users");
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then((res) => {
    console.log("Success");
  })
  .catch((err) => {
    console.log(err);
  });

const verifyUser = (req, res, next) => {
  const token = req.cookies.AuthToken;
  if (!token) {
    return res.json("Token is missing");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json("Error with token");
      } else {
        if (decoded.Role === "Admin") {
          next();
        } else {
          return res.json("Not an admin");
        }
      }
    });
  }
};

app.get("/Dashboard", verifyUser, (req, res) => {
  res.json(res.data);
});

app.post("/Reg", (req, res) => {
  const { Name, Email, Password } = req.body;
  UserModel.findOne({ Email: Email })
    .then((existingUser) => {
      if (existingUser) {
        res.json("Email is already registered");
      } else {
        bcrypt
          .hash(Password, 10)
          .then((hash) => {
            UserModel.create({ Name, Email, Password: hash })
              .then(() => {
                res.json("Success");
              })
              .catch((err) => {
                res.json(err);
              });
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/Login", (req, res) => {
  const { Email, Password } = req.body;
  UserModel.findOne({ Email: Email })
    .then((user) => {
      if (user) {
        bcrypt.compare(Password, user?.Password, (err, response) => {
          if (response) {
            const token = jwt.sign(
              { Email: user.Email, Role: user.Role },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "7d" }
            );
            res.cookie("AuthToken", token);
            res.json({ message: "Success", token: token, Role: user.Role });
          } else {
            res.json("Email/Password is Incorrect");
          }
        });
      } else {
        res.json("Email is not registered yet");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(3001, () => {
  console.log("Server is Running");
});
