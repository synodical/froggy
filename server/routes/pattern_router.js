const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const router = express.Router();
const { Pattern, Image, Liked, sequelize } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

//services
const PatternService = require("../services/pattern_service");
const CommonService = require("../common/common_service");
const RecommendService = require("../services/recommend_service");
const PatternRecommendService = require("../services/pattern_recommend_service");
//controller
const PatternAttributeController = require("../controllers/pattern_attribute_controller");
const ReviewController = require("../controllers/review_controller");
const PatternController = require("../controllers/pattern_controller");
const LikedController = require("../controllers/liked_controller");

// router.get("/flask/test", async (req, res, next) => {
//   try {
//     let resJson = { status: "N" };
//     // await PatternController.deletePattern({ importantList: famousList });
//     await PatternController.deleteImage({ importantList: famousList });
//     // const recommendPatternResult = await RecommendService.getRecommendPattern(
//     //   req,
//     //   res,
//     //   {}
//     // );
//     // // console.log(recommendPatternResult);
//     // resJson["patternList"] = recommendPatternResult;
//     // resJson["status"] = "Y";
//     return res.json(resJson);
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// });
router.post("/:patternId/reviews", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const { contents, rating } = req.body;
    const patternId = req.params.patternId;
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
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/reviews", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const reviewList = await ReviewController.getPatternReviewByUser({ user });
    resJson["status"] = "Y";
    resJson["reviewList"] = reviewList;
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/:patternId/reviews", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const patternId = req.params.patternId;
    const reviewList = await ReviewController.getPatternReview(patternId);
    resJson["status"] = "Y";
    resJson["reviewList"] = reviewList;
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/search", async (req, res, next) => {
  let resJson = { status: "N" };
  let keyword = req.query[0];
  // console.log(keyword);
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
    // console.log(err);
    return next(err);
  }
});

router.post("/liked/:id/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const { id } = req.params;
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }

    await LikedController.savePatternLike({ user, patternId: id });
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/liked/list/", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }

    const LikedPatternIdList = await LikedController.getLikedPatternIdList({
      user,
    });
    let patternList = [];
    for (let el of LikedPatternIdList) {
      const result = await PatternController.getPatternWithImage({
        id: el.patternId,
      });
      if (!result) {
        continue;
      }
      patternList.push(result);
    }
    resJson["patternList"] = patternList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  let resJson = { status: "N" };
  const patternId = req.params.id;
  const user = req.user;
  try {
    let pattern = await PatternController.getPatternWithImage({
      id: patternId,
    });
    if (!CommonService.isEmpty(user)) {
      pattern = await PatternService.addLikedInfo(pattern, user);
    }
    resJson["pattern"] = pattern;
    resJson["status"] = "Y";
    // console.log(resJson);
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
router.get("/recommend/doll", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const patternIdList = [42122, 20686, 11649, 36205, 17208, 39097, 26395];
    for (let el of patternIdList) {
      let pattern = await PatternController.getPatternList({ id: el });
      pattern = pattern[0];
      const imageResult = await PatternService.getPatternImage(pattern);
      if (!imageResult) {
        continue;
      } else {
        pattern["thumbnail"] = imageResult.mediumUrl;
      }
      // pattern = await PatternService.addLikedInfo(pattern, user);
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
router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  let patternList = [];
  try {
    const { user } = req;
    const randPattern = await Pattern.findAll({
      // attributes: ["id"],
      order: Sequelize.fn("RAND"),
      limit: 10, // limit으로 반환받을 row 수를 정할 수 있어요
      raw: true,
    });
    for (let rp of randPattern) {
      if (CommonService.isEmpty(rp.mediumUrl)) {
        const images = await Image.findAll({
          where: {
            targetType: "pattern",
            targetId: rp.id,
          },
          raw: true,
        });

        rp["thumbnail"] = images[0].mediumUrl;
      }
      if (!CommonService.isEmpty(user)) {
        rp = await PatternService.addLikedInfo(rp, user);
      }
      if (!CommonService.isEmpty(rp.thumbnail)) {
        patternList.push(rp);
      }
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