const PatternController = require("../controllers/pattern_controller");

const PatternRecommendService = {
  async getRecommendListByDifficulty(paramJson) {
    const { user } = paramJson;
    const { proficiency } = user;
    let patternList = [];
    if (proficiency === 0) {
      patternList = await PatternController.getPatternList({
        maxDifficulty: 1.1,
        minDifficulty: 0,
      });
    } else if (proficiency === 1) {
      patternList = await PatternController.getPatternList({
        maxDifficulty: 5,
        minDifficulty: 2,
      });
    } else if (proficiency === 2) {
      patternList = await PatternController.getPatternList({
        maxDifficulty: 10,
        minDifficulty: 4,
      });
    }
    return patternList;
  },
  async getRecommendListByCrochet(paramJson) {
    const { user } = paramJson;
    const { crochet } = user;
    if (crochet === 1) {
      patternList = await PatternController.getPatternList({
        craft: "Crochet",
      });
      return patternList;
    } else {
      return false;
    }
  },
  async getRecommendListByKnitting(paramJson) {
    const { user } = paramJson;
    const { knitting } = user;
    if (knitting === 1) {
      patternList = await PatternController.getPatternList({
        craft: "Knitting",
      });
      return patternList;
    } else {
      return false;
    }
  },
  async getRecommendListByAttribute(paramJson) {
    const { user } = paramJson;
    const { attributeIdArr } = user;
  },
};

module.exports = PatternRecommendService;
