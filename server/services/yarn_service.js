const { Yarn, Image, Liked } = require("../models");
const LikedController = require("../controllers/liked_controller");

const YarnService = {
  async getYarnImage(yarn) {
    const image = await Image.findOne({
      attributes: ["mediumUrl"],
      where: {
        targetType: "yarn",
        targetId: yarn.id,
      },
      raw: true,
    });
    if (image === null) {
      return false;
    }
    return image;
  },
  async addLikedInfo(yarn, user) {
    const eachLiked = await Liked.findOne({
      where: {
        targetType: "yarn",
        targetId: yarn.id,
        userId: user.id,
      },
    });

    if (eachLiked === null) {
      yarn["liked"] = "N";
    } else {
      yarn["liked"] = "Y";
    }
    return yarn;
  },

  async getLikedYarnList(paramJson) {
    const { user } = paramJson;
    const LikedYarnIdList = await LikedController.getLikedYarnIdList({
      user: user,
    });
  },
};

module.exports = YarnService;
