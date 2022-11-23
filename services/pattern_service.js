const { Pattern, Image, LikedPattern } = require("../models");
const { sequelize } = require("../models");
const LikedController = require("../controllers/liked_controller");
const PatternController = require("../controllers/pattern_controller");
const CommonService = require("../common/common_service");
const PatternService = {
  async getPatternImage(pattern) {
    const image = await Image.findOne({
      attributes: ["mediumUrl"],
      where: {
        targetType: "pattern",
        targetId: pattern.id,
      },
      raw: true,
    });
    if (image === null) {
      return false;
    }
    return image;
  },
  async addLikedInfo(pattern, user) {
    const eachLiked = await LikedPattern.findOne({
      where: {
        patternId: pattern.id,
        userId: user.id,
      },
    });

    if (eachLiked === null) {
      pattern["isFavorite"] = false;
    } else {
      pattern["isFavorite"] = true;
    }
    return pattern;
  },

  async getLikedPatternList(paramJson) {
    const { user } = paramJson;
    const LikedPatternIdList = await LikedController.getLikedPatternIdList({
      user: user,
    });
  },
  async getPatternListPaging(dataJson) {
    try {
      let resJson = { status: "N" };

      const { LikedPatternIdList, customOrderBy, PAGE, boardLineLimit } =
        dataJson;
      paramJson = {
        customOrderBy: customOrderBy,
      };
      if (LikedPatternIdList) {
        let idList = [];
        for (let likedPattern of LikedPatternIdList) {
          idList.push(likedPattern.patternId);
        }
        paramJson["patternIdList"] = idList;
      }

      let condJson = PatternController.getCondJson(paramJson);

      condJson["PAGE"] = dataJson.PAGE;
      const lineLimit = dataJson.boardLineLimit;
      paramJson["lineLimit"] = lineLimit;

      let result = {};
      let tot_cnt;

      await Pattern.count(condJson)
        .then(function (cnt) {
          tot_cnt = cnt;
        })
        .catch(function (err) {
          // CommonService.handleError(err, req, res, req.transaction);
          result = false;
          return;
        });

      var paging = await CommonService.getPagingData(
        dataJson.PAGE,
        tot_cnt,
        paramJson.lineLimit
      );

      // condJson["order"] = sequelize.literal("createdAt DESC, updatedAt DESC");
      condJson["offset"] = paging.offset * lineLimit || 0; //시작 번호
      condJson["limit"] = lineLimit; //출력 row 수

      const patternList = await Pattern.findAll(condJson);

      result["status"] = "Y";
      result["paging"] = paging;
      result["patternList"] = patternList;
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = PatternService;
