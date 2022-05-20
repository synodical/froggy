const express = require("express");
const Customer = require("../models/customer").Customer;
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("main", {
    title: "froggy",
  });
});

module.exports = router;
