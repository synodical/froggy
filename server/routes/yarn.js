const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models").Customer;
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
  res.render("yarn.html", {
    title: "froggy",
    customer: req.user,
    loginError: req.flash("loginError"),
  });
});

module.exports = router;
