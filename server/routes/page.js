const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models/customer").Customer;
const router = express.Router();

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입",
    user: req.user,
    joinError: req.flash("joinError"),
  });
});

router.get("/", async (req, res, next) => {
  res.render("main", {
    title: "froggy",
  });
});

module.exports = router;
