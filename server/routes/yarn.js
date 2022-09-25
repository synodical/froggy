const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Yarn = require("../models").Yarn;
const router = express.Router();
const axios = require("axios");
const Sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const randYarn = await Yarn.findAll({
      order: Sequelize.fn("RAND"),
      limit: 5,
    });
    resJson["randYarn"] = randYarn;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
