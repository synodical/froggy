const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models").Customer;
const router = express.Router();

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입",
    user: req.user,
    joinError: req.flash("joinError"),
  });
});

router.get("/", async (req, res, next) => {
  console.log("------------");
  console.log(req.user);
  res.render("main", {
    title: "froggy",
    customer: req.user,
    loginError: req.flash("loginError"),
  });
});

module.exports = router;
