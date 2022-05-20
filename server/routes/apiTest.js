const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.render("apiTest.html", {
    title: "Testing Api",
  });
});

module.exports = router;
