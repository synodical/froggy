const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Yarn = require("../models").Yarn;
const router = express.Router();
const axios = require("axios");
const { Pattern, Customer, Image } = require("../models");
const Sequelize = require("sequelize");

router.get("/:id", async (req, res, next) => {
  let resJson = { status: "N" };
  const yarnId = req.params.id;
  try {
    const yarn = await Yarn.findOne({
      where: { id: yarnId },
    });
    const images = await Image.findAll({
      where: {
        targetType: "yarn",
        targetId: yarnId,
      },
      raw: true,
    });
    resJson["image"] = images;
    resJson["yarn"] = yarn;
    resJson["status"] = "Y";
    console.log(resJson);
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const randYarn = await Yarn.findAll({
      order: Sequelize.fn("RAND"),
      limit: 18,
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
