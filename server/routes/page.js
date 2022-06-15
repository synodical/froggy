const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models").Customer;
const router = express.Router();
const axios = require("axios");

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입",
    customer: req.customer,
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
