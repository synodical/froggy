const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Yarn = require("../models").Yarn;
const router = express.Router();
const axios = require("axios");
const Sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  // res.render("yarn.html", {
  //   title: "froggy",
  //   customer: req.user,
  //   loginError: req.flash("loginError"),
  // });
  let resJson = { status: "N" };
  try {
    const randYarn = await Yarn.findAll({
      // attributes: ["id"],
      order: Sequelize.fn("RAND"),
      limit: 5, // limit으로 반환받을 row 수를 정할 수 있어요
    });
    resJson['randYarn'] = randYarn;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
