const { Pattern, Image, LikedPattern } = require("../models");
const LikedController = require("../controllers/liked_controller");
const PatternController = require("../controllers/pattern_controller");

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
  getPatternListPaging: async function (paramJson) {
    try {
      // const {PAGE} =

      let result = { status: "N" };
      let condJson = PatternController.getPatternList(paramJson);
      condJson["PAGE"] = paramJson.PAGE;
      const lineLimit = paramJson.boardLineLimit
        ? paramJson.boardLineLimit
        : res.locals.meta.BOARD_LINE_LIMIT;
      paramJson["lineLimit"] = lineLimit;
      const paging = await PatternController.getPatternListPaging(
        req,
        res,
        condJson,
        paramJson
      );
      if (!paging) return result;

      condJson["order"] = sequelize.literal("createDate DESC, updateDate DESC");
      condJson["offset"] =
        paging.offset * res.locals.meta.BOARD_LINE_LIMIT || 0; //시작 번호
      condJson["limit"] = req.query.size || res.locals.meta.BOARD_LINE_LIMIT; //출력 row 수

      const patternList = await PatternController.getMdItemList(
        req,
        res,
        condJson
      );
      if (!mdItemList) return result;

      result["status"] = "Y";
      result["paging"] = paging;
      result["mdItemList"] = mdItemList;
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = PatternService;
