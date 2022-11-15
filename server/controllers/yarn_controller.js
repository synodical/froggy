const { Yarn, Image } = require("../models");
const CommonService = require("../common/common_service");

const YarnController = {
  async getYarnWithImage(paramJson) {
    const condJson = this.applyWhereCond(paramJson);
    const yarnResult = await Yarn.findOne(condJson);

    if (CommonService.isEmpty(yarnResult.mediumUrl)) {
      const images = await Image.findAll({
        where: {
          targetType: "yarn",
          targetId: yarnResult.id,
        },
        raw: true,
      });
      yarnResult["thumbnail"] = images[0].mediumUrl;
    }
    return yarnResult;
  },
  applyWhereCond(paramJson) {
    let condJson = {
      raw: true,
      where: {},
    };
    if (paramJson.id) condJson.where["id"] = paramJson.id;
    return condJson;
  },
};
module.exports = YarnController;
