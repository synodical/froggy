const { Pattern, Image, Liked } = require("../models");
const LikedController = require("../controllers/liked_controller");

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
      pattern["liked"] = "N";
    } else {
      pattern["liked"] = "Y";
    }
    return pattern;
  },

  async getLikedPatternList(paramJson) {
    const { user } = paramJson;
    const LikedPatternIdList = await LikedController.getLikedPatternIdList({
      user: user,
    });
  },
};

module.exports = PatternService;
