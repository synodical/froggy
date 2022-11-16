const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Image, sequelize, Yarn } = require("../models");
const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");

//services
const YarnService = require("../services/yarn_service");
const CommonService = require("../common/common_service");
//controller
const LikedController = require("../controllers/liked_controller");
const YarnController = require("../controllers/yarn_controller");
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