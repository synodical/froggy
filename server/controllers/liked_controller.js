const { Liked } = require("../models");
const CommonService = require("../common/common_service");

const LikedController = {
  async getLikedPatternIdList(paramJson) {
    const { user } = paramJson;
    const LikedPatternIdList = await Liked.findAll({
      where: { targetType: pattern, userId: user.id },
      raw: true,
    });
    return LikedPatternIdList;
  },
};

module.exports = LikedController;
