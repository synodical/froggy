const { PatternCategory } = require("../models");
const CommonService = require("../common/common_service");

const PatternCategoryController = {
  async insertPatternCategory(paramJson) {
    const patternCategoryList = paramJson.patternCategory;
    const patternCategory = patternCategoryList[0];
    const { parent } = patternCategory;

    const patternCategoryResult = await PatternCategory.findOne({
      where: { id: patternCategory.id },
    });
    if (CommonService.isEmpty(patternCategoryResult)) {
      const insertResult = await PatternCategory.create({
        id: patternCategory.id,
        category: patternCategory.permalink,
        parentId: parent.id,
      });
      return insertResult;
    } else {
      return false;
    }
  },
};

module.exports = PatternCategoryController;
