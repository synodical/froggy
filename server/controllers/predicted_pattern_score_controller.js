const { PredictedPatternScore } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");

const RecommendPatternListService = require("../common/recommend_pattern_list_service");
const PatternController = require("../controllers/pattern_controller");
const CommonService = require("../common/common_service");

const PredictedPatternScoreController = {
  async createPredictbyBulk(paramJson) {
    try {
      const { userId, scoreList } = paramJson;
      console.log(userId, scoreList);
      const patternDict = RecommendPatternListService.getList();
      let payload = [];
      for (let i = 0; i < scoreList.length; i++) {
        let raverlyId = patternDict[i];
        payload.push({
          userId: userId,
          patternRaverlyId: raverlyId,
          predictedScore: scoreList[i],
        });
      }
      PredictedPatternScore.destroy({
        where: {
          userId: userId,
        },
        force: true,
      });
      const insertResult = await PredictedPatternScore.bulkCreate(payload);
      return insertResult;
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};
module.exports = PredictedPatternScoreController;
