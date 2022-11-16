const { PredictedPatternScore } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");

const RecommendPatternListService = require("../common/recommend_pattern_list_service");
const PatternController = require("../controllers/pattern_controller");
const CommonService = require("../common/common_service");

const PredictedPatternScoreController = {
  async upsertPredictedPatternScore(paramJson) {
    try {
      const { userId, scoreList } = paramJson;
      const patternDict = RecommendPatternListService.getList();
      for (let i = 0; i < scoreList.length; i++) {
        const test = patternDict[36];
        console.log(test);
        const pattern = await PatternController.getPatternList({
          raverlyId: patternDict[i],
        });
        if (CommonService.isEmpty(pattern)) continue;
        const PredictedPatternScoreResult = await PredictedPatternScore.findOne(
          {
            where: { userId: userId, patternId: pattern.id },
            raw: true,
          }
        );
        if (!CommonService.isEmpty(PredictedPatternScoreResult)) {
          await this.updatePredictedPatternScore({
            userId: userId,
            patternId: pattern.id,
            predictedScore: scoreList[i],
          });
        } else {
          await this.insertPredictedPatternScore({
            userId: userId,
            patternId: pattern.id,
            predictedScore: scoreList[i],
          });
        }
      }
      return true;
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  async updatePredictedPatternScore(paramJson) {
    const { userId, patternId, predictedScore } = paramJson;
    const updateResult = await PredictedPatternScore.update(
      {
        predictedScore: predictedScore,
      },
      {
        where: { userId: userId, patternId: patternId },
      }
    );
    return updateResult;
  },
  async insertPredictedPatternScore(paramJson) {
    const { userId, patternId, predictedScore } = paramJson;
    const insertResult = await PredictedPatternScore.create({
      userId: userId,
      patternId: patternId,
      predictedScore: predictedScore,
    });
    return insertResult;
  },
};
module.exports = PredictedPatternScoreController;
