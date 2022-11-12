const express = require("express");
const { request } = require("http");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, User, Image, Liked, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

//services
const PatternService = require("../services/pattern_service");
const CommonService = require("../common/common_service");
const RecommendService = require("../services/recommend_service");
const PatternRecommendService = require("../services/pattern_recommend_service");
//controller
const PatternAttributeController = require("../controllers/pattern_attribute_controller");
const CommunityController = require("../controllers/community_controller");
const ReviewController = require("../controllers/review_controller");

const e = require("connect-flash");
const image = require("../models/image");

router.post("/reviews", async (req, res, next) => {
  let resJson = { status: "N" };
  const { contents, patternId, rating } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }
  await ReviewController.savePatternReview({
    user,
    patternId,
    contents,
    rating,
  });
  resJson["status"] = "Y";
  return res.json(resJson);
});

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

router.post("/liked/:id/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    let exLiked = await Liked.findOne({
      where: {
        targetType: "pattern",
        targetId: req.params.id,
        userId: req.user.id,
      },
      paranoid: false,
      raw: true,
    });
    if (exLiked) {
      // 이미 존재하는 경우
      if (exLiked.deletedAt) {
        // 삭제되었던 경우
        Liked.restore({
          where: {
            targetType: "pattern",
            targetId: req.params.id,
            userId: req.user.id,
          },
          paranoid: false,
        });
      } else {
        // 삭제되지 않은 경우
        Liked.destroy({
          where: {
            targetType: "pattern",
            targetId: req.params.id,
            userId: req.user.id,
          },
        });
      }
    } else {
      Liked.create({
        targetType: "pattern",
        targetId: req.params.id,
        userId: req.user.id,
      });
    }
    return res.json(resJson);
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
      raw: true,
    });
    const images = await Image.findAll({
      where: {
        targetType: "pattern",
        targetId: patternId,
      },
      raw: true,
    });
    pattern["thumbnail"] = images[0].mediumUrl;
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

router.get("/attribute/list", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const patternAttributeList =
      await PatternAttributeController.getPatternAttributeList();
    resJson["patternAttributeList"] = patternAttributeList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/recommend/difficulty", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const { user } = req;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const patternRecommendResult =
      await PatternRecommendService.getRecommendListByDifficulty({ user });
    patternRecommendResult.sort(() => Math.random() - 0.5);
    let patternRecommend6 = patternRecommendResult.slice(0, 10);
    for (let pattern of patternRecommend6) {
      const imageResult = await PatternService.getPatternImage(pattern);
      if (!imageResult) {
        continue;
      } else {
        pattern["thumbnail"] = imageResult.mediumUrl;
      }
      pattern = await PatternService.addLikedInfo(pattern, user);
      patternList.push(pattern);
    }
    resJson["patternList"] = patternList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/recommend/crochet", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const { user } = req;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const patternRecommendResult =
      await PatternRecommendService.getRecommendListByCrochet({ user });
    patternRecommendResult.sort(() => Math.random() - 0.5);
    let patternRecommend6 = patternRecommendResult.slice(0, 10);
    for (let pattern of patternRecommend6) {
      const imageResult = await PatternService.getPatternImage(pattern);
      if (!imageResult) {
        continue;
      } else {
        pattern["thumbnail"] = imageResult.mediumUrl;
      }
      pattern = await PatternService.addLikedInfo(pattern, user);
      patternList.push(pattern);
    }
    resJson["patternList"] = patternList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/recommend/knitting", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const { user } = req;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const patternRecommendResult =
      await PatternRecommendService.getRecommendListByKnitting({ user });
    patternRecommendResult.sort(() => Math.random() - 0.5);
    let patternRecommend6 = patternRecommendResult.slice(0, 10);
    for (let pattern of patternRecommend6) {
      const imageResult = await PatternService.getPatternImage(pattern);
      if (!imageResult) {
        x;
        continue;
      } else {
        pattern["thumbnail"] = imageResult.mediumUrl;
      }
      pattern = await PatternService.addLikedInfo(pattern, user);
      patternList.push(pattern);
    }
    resJson["patternList"] = patternList;
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
    console.log("text");
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

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const { user } = req;
    const randPattern = await Pattern.findAll({
      // attributes: ["id"],
      order: Sequelize.fn("RAND"),
      limit: 15, // limit으로 반환받을 row 수를 정할 수 있어요
      raw: true,
    });
    for (let rp of randPattern) {
      const imageResult = await PatternService.getPatternImage(rp);
      if (!imageResult) {
        continue;
      } else {
        rp["thumbnail"] = imageResult.mediumUrl;
      }

      if (!CommonService.isEmpty(user)) {
        rp = await PatternService.addLikedInfo(rp, user);
      }
      patternList.push(rp);
    }
    resJson["patternList"] = patternList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
