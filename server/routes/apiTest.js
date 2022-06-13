const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("apiTest.html", {
    title: "Testing Api",
  });
});

router.get("/movie", async (req, res, next) => {
  res.render("movie.html", {
    title: "Testing Api",
  });
});

module.exports = router;
