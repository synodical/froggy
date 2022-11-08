const { Pattern, Image, Liked } = require("../models");

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
    const eachLiked = await Liked.findOne({
      where: {
        targetType: "pattern",
        targetId: pattern.id,
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
};

module.exports = PatternService;
