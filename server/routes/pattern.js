const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, Customer, Image, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

const RecommendService = require("../controllers/recommend_service");

router.get("/search", async (req, res, next) => {
  let resJson = { status: "N" };
  let keyword = req.query[0];
  console.log(keyword);
  keyword = keyword.toString().replace(" ", "%"); // db에는 빨간실로 저장되어 있지만, 빨간 실로 검색한 경우
  // keyword = `%${keyword.replace(/ /gi, "%")}%`;
  const query =
    // 'select * from pattern where replace(name," ","") like :keyword or replace(author," ","") like :keyword';
    `select * from pattern where name like '%${keyword}%' or author like '%${keyword}%'`;
  try {
    const searchList = await sequelize.query(query, {
      replacements: { keyword: keyword },
      type: QueryTypes.SELECT,
      raw: true,
    });

    for (let searchResult of searchList) {
      const eachImage = await Image.findOne({
        attributes: ["mediumUrl"],
        where: {
          targetType: "pattern",
          targetId: searchResult.id,
        },
        raw: true,
      });
      if (eachImage === null) {
        searchResult["thumbnail"] = null;
      } else {
        searchResult["thumbnail"] = eachImage.mediumUrl;
      }
      resJson["searchList"] = searchList;
      return res.json(resJson);
    }
  } catch (err) {
    console.log(err);
    return next(err);
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

router.get("/:id", async (req, res, next) => {
  let resJson = { status: "N" };
  const patternId = req.params.id;
  try {
    const pattern = await Pattern.findOne({
      where: { id: patternId },
    });
    const images = await Image.findAll({
      where: {
        targetType: "pattern",
        targetId: patternId,
      },
    });
    resJson["image"] = images;
    resJson["pattern"] = pattern;
    resJson["status"] = "Y";
    console.log(resJson);
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log("no user");
  }
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
      if (eachImage === null) {
        rp["thumbnail"] = null;
      } else {
        rp["thumbnail"] = eachImage.mediumUrl; // null일때 예외처리하기
      }
    }
    resJson["patternList"] = randPattern;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//flask test 를 위한 라우터 입니다.
// flask 서버로 요청을 보낸 뒤 값을 반환합니다.

router.get("/flask/test", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const recommendPatternResult = await RecommendService.getRecommendPattern(
      req,
      res,
      {}
    );
    console.log(recommendPatternResult);
    resJson["patternList"] = recommendPatternResult;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
