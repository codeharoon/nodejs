require('dotenv').config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const RegsiterUser = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  confirmPassword: {
    type: String,
    required: true,
  },
});

RegsiterUser.methods.createUserToken = async function () {
  try {
    let genratetoken = await jwt.sign(
      { _id: this._id },
      process.env.SECRET_KEY
    );
    this.tokens=this.tokens.concat({token:genratetoken});
    await this.save()
    return genratetoken;
  } catch (error) {
    console.log(`error is ${error}`);
  }
};

RegsiterUser.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = new mongoose.model("Registration", RegsiterUser);

module.exports = User;
