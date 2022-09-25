const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Yarn = require("../models").Yarn;
const router = express.Router();
const axios = require("axios");
const { Pattern, Customer, Image } = require("../models");
const Sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const randYarn = await Yarn.findAll({
      order: Sequelize.fn("RAND"),
      limit: 5,
      raw: true,
    });
    for (let ry of randYarn) {
      const eachImage = await Image.findOne({
        attributes: ["mediumUrl"],
        where: {
          targetType: "yarn",
          targetId: ry.id,
        },
        raw: true,
      });
      ry["thumbnail"] = eachImage.mediumUrl;
    }
    console.log(randYarn);
    resJson["randYarn"] = randYarn;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
