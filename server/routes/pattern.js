const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, Customer } = require("../models");
const Sequelize = require("sequelize");

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const randPattern = await Pattern.findAll({
      // attributes: ["id"],
      order: Sequelize.fn("RAND"),
      limit: 5, // limit으로 반환받을 row 수를 정할 수 있어요
    });
    let Images = [];
    randPattern.forEach((element) => {
      const eachImage = Image.findOne({
        attributes: ["squareUrl"],
        where: {
          targetType: "Pattern",
          targetId: element.id,
        },
      });
      Images.push(eachImage);
    });
    resJson["images"] = Images;
    resJson["randPattern"] = randPattern;
    resJson["status"] = "Y";
    return res.json(randPattern);
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
