const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, Customer, Image } = require("../models");
const Sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const randPattern = await Pattern.findAll({
      // attributes: ["id"],
      order: Sequelize.fn("RAND"),
      limit: 15, // limit으로 반환받을 row 수를 정할 수 있어요
      raw: true,
    });
    for (let rp of randPattern) {
      const eachImage = await Image.findOne({
        attributes: ["mediumUrl"],
        where: {
          targetType: "pattern",
          targetId: rp.id,
        },
        raw: true,
      });
      rp["image"] = eachImage;
    }
    // randPattern["images"] = Images;
    resJson["patternList"] = randPattern;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/:id/liked", async (req, res, next) => {
  try {
    Customer.addLikedPattern(Pattern, { through: { status: "started" } });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
