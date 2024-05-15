const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = require("../schemas/userSchema");
const booking = require("../schemas/bookingSchema");

const key = "secretkey";

const register = async (req, resp) => {
  try {
    let email = req.body.email;
    let find = await user.findOne({ email });
    if (find) {
      resp.json({
        message: "email already exists",
      });
    } else if (req.body.password && req.body.email && req.body.username) {
      const salt = bcrypt.genSaltSync(10);
      const hashedpassword = bcrypt.hashSync(req.body.password, salt);
      const newUser = new user({
        username: req.body.username,
        role: req.body.role,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedpassword,
      });
      const save = await newUser.save();
      jwt.sign(req.body, key, (err, token) => {
        if (err) {
          console.log(err);
        } else {
          resp.json({
            token: token,
            message: "User registered successfully",
          });
        }
      });
    } else {
      resp.json({
        message: "please provide all required fields",
      });
    }
  } catch (err) {
    resp.json(err);
  }
};

const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    const findUser = await user.findOne({ email });
    if (findUser) {
      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        jwt.sign(req.body, key, (err, token) => {
          if (err) {
            resp.json({ message: err.message });
          } else {
            resp.json({
              token: token,
              message: "User logged in successfully",
            });
          }
        });
      } else {
        resp.json({
          message: "email or password is incorrect",
        });
      }
    } else {
      resp.json({
        message: "email or password is incorrect",
      });
    }
  } catch (err) {
    resp.json(err);
  }
};

const userDetails = async (req, resp) => {
  try {
    const user_id = req.params.id;
    const findUser = await user.findOne({ _id: user_id });
    if (!findUser) {
      resp.json({
        message: "user not found",
      });
    } else {
      resp.json(findUser);
    }
  } catch (err) {
    resp.json(err);
  }
};

const updateUserDetails = async (req, resp) => {
  try {
    const user_id = req.params.id;
    const findUser = await user.findOne({ _id: user_id });
    if (!findUser) {
      resp.json({
        message: "user not found",
      });
    } else {
      const updateUser = await user.updateOne(
        { _id: user_id },
        {
          $set: {
            username: req.body.username,
            role: req.body.role,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
          },
        }
      );
      if (updateUser.acknowledged) {
        resp.json({
          message: "user updated successfully",
        });
      } else {
        resp.json({
          message: "user not updated successfully",
        });
      }
    }
  } catch (err) {
    resp.json(err);
  }
};

module.exports = {
  login,
  register,
  userDetails,
  updateUserDetails,
};
