const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, Customer, Image, sequelize, Yarn } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

router.get("/search", async (req, res, next) => {
  let keyword = req.query[0];
  console.log(keyword);
  keyword = keyword.toString().replace(" ", "%"); // db에는 빨간실로 저장되어 있지만, 빨간 실로 검색한 경우
  // keyword = `%${keyword.replace(/ /gi, "%")}%`;
  const query = `select * from yarn where name like '%${keyword}%' or yarnCompanyName like '%${keyword}%'`;
  try {
    const searchList = await sequelize.query(query, {
      replacements: { keyword: keyword },
      type: QueryTypes.SELECT,
      raw: true,
    });
    if (searchList.length == 0) {
      res.status(204).json({
        message: "No results or fail",
      });
    } else {
      for (let searchResult of searchList) {
        const eachImage = await Image.findOne({
          attributes: ["mediumUrl"],
          where: {
            targetType: "yarn",
            targetId: searchResult.id,
          },
          raw: true,
        });
        if (eachImage === null) {
          searchResult["thumbnail"] = null;
        } else {
          searchResult["thumbnail"] = eachImage.mediumUrl; // null일때 예외처리하기
        }
      }
      res.status(200).json({
        searchList: searchList,
      });
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  let resJson = { status: "N" };
  const yarnId = req.params.id;
  try {
    const yarn = await Yarn.findOne({
      where: { id: yarnId },
      raw: true,
    });
    const images = await Image.findAll({
      where: {
        targetType: "yarn",
        targetId: yarnId,
      },
      raw: true,
    });

    yarn["thumbnail"] = images[0].mediumUrl;
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
      limit: 10,
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
      if (eachImage === null) {
        ry["thumbnail"] = null;
      } else {
        ry["thumbnail"] = eachImage.mediumUrl; // null일때 예외처리하기
      }
    }
    resJson["randYarn"] = randYarn;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
