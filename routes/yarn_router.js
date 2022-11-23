const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Image, sequelize, Yarn } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const multer = require("multer"); // multer

//services
const YarnService = require("../services/yarn_service");
const CommonService = require("../common/common_service");
//controller
const ReviewImageController = require("../controllers/review_image_controller");
const LikedController = require("../controllers/liked_controller");
const ReviewController = require("../controllers/review_controller");
const YarnController = require("../controllers/yarn_controller");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // no larger than 20mb, you can change as needed.
  },
});
router.post(
  "/:yarnId/reviews",
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      let resJson = { status: "N" };
      const { data } = req.body;
      const dataJson = JSON.parse(data);
      const { rating, contents } = dataJson;
      if (req.files !== undefined && req.files.length > 0) {
        imagesData = [...req.files];
      }

      const yarnId = req.params.yarnId;
      const user = req.user;
      if (CommonService.isEmpty(user)) {
        resJson["isUserLogin"] = "N";
        return res.json(resJson);
      }
      const isReviewed = await ReviewController.isYarnReviewed({
        user,
        yarnId,
      });
      if (isReviewed) {
        resJson["status"] = "N";
        resJson["reason"] = "Review already exists";
        return res.json(resJson);
      }
      const yarnReviewResult = await ReviewController.saveYarnReview({
        user,
        yarnId,
        contents,
        rating,
      });
      await ReviewImageController.insertYarnReviewImage(req, res, {
        yarnId: yarnId,
        imagesData: imagesData,
        yarnReviewId: yarnReviewResult.dataValues.id,
      });

      resJson["status"] = "Y";
      return res.json(resJson);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

router.delete("/:yarnId/reviews", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const yarnId = req.params.yarnId;
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const deleteResult = await ReviewController.deleteYarnReview({
      user,
      yarnId,
    });
    resJson["status"] = "Y";
    resJson["deleteResult"] = deleteResult;
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
    const reviewList = await ReviewController.getYarnReviewByUser({ user });

    resJson["status"] = "Y";
    resJson["reviewList"] = reviewList;
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/:yarnId/reviews", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const yarnId = req.params.yarnId;
    const reviewList = await ReviewController.getYarnReview(yarnId);
    resJson["status"] = "Y";
    resJson["reviewList"] = reviewList;
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
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

    await LikedController.saveYarnLike({ user, yarnId: id });
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

    const LikedYarnIdList = await LikedController.getLikedYarnIdList({
      user,
    });
    let yarnList = [];
    for (let el of LikedYarnIdList) {
      const result = await YarnController.getYarnWithImage({
        id: el.yarnId,
      });
      yarnList.push(result);
    }
    resJson["yarnList"] = yarnList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

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
  const user = req.user;
  try {
    let yarn = await Yarn.findOne({
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

    if (!CommonService.isEmpty(user)) {
      yarn = await YarnService.addLikedInfo(yarn, user);
    }
    resJson["image"] = images;
    resJson["yarn"] = yarn;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  let resJson = { status: "N" };
  let yarnList = [];
  try {
    const randYarn = await Yarn.findAll({
      order: Sequelize.fn("RAND"),
      limit: 10,
      raw: true,
    });
    for (let ry of randYarn) {
      const imageResult = await YarnService.getYarnImage(ry);
      if (!imageResult) {
        continue;
      } else {
        ry["thumbnail"] = imageResult.mediumUrl;
        yarnList.push(ry);
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
