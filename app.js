require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require('bcrypt');
const app = express();
require("./db/conn");
const User = require("./models/register");
const { send } = require("process");
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./templates"));
hbs.registerPartials(path.join(__dirname, "./templates/partial"));
app.use(express.urlencoded({ extended: false }));

console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("registration");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password === confirmpassword) {
      const newUSer = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: password,
        confirmPassword: confirmpassword,
      });
      const token = await newUSer.createUserToken();
      // const registerUser = await newUSer.save();
      if (token) {
        res.status(201).render("registration");
      }
    } else {
      res.send("password is not match");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  try {
    const loginuser = await User.findOne({ email: req.body.email });
   
    const isMatch = await bcrypt.compare(req.body.password, loginuser.password);

    const token = await loginuser.createUserToken();

    if (isMatch) {
      res.redirect("/");
    }
  } catch (error) {
    res.status(400), send(error);
  }
});

app.listen(port);
