const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models").Customer;
const router = express.Router();
const axios = require("axios");

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입",
    joinError: req.flash("joinError"),
  });
});

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", {
    title: "로그인",
    joinError: req.flash("joinError"),
  });
});

router.get("/", async (req, res, next) => {
  res.render("main.html", {
    title: "froggy",
    customer: req.user,
    loginError: req.flash("loginError"),
  });
});

module.exports = router;
