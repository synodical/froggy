const { PatternAttribute } = require("../models");
const CommonService = require("../common/common_service");

const PatternAttributeController = {
  async insertPatternAttribute(paramJson) {
    const PatternAttributeResult = await PatternAttribute.findOne({
      where: { id: paramJson.id },
      raw: true,
    });
    if (CommonService.isEmpty(PatternAttributeResult)) {
      const insertResult = await PatternAttribute.create({
        id: paramJson.id,
        attribute: paramJson.permalink,
      });
      return insertResult;
    }
    return false;
  },
  async getPatternAttributeList() {
    const PatternAttributeResult = await PatternAttribute.findAll({
      raw: true,
    });
    return PatternAttributeResult;
  },
};

module.exports = PatternAttributeController;
