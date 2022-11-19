const { PredictedPatternScore, Pattern } = require("../models");
const { sequelize } = require("../models");

const RecommendPatternListService = require("../common/recommend_pattern_list_service");
const PatternController = require("../controllers/pattern_controller");
const CommonService = require("../common/common_service");
const { param } = require("../routes/pattern_router");

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
      await PredictedPatternScore.destroy({
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
  async getPredictedPatternScoreJoinPatternList(paramJson) {
    //pattern list 반환하나, 1개일때는 그냥 하나를 반환
    const condJson = this.getPredictedPatternScoreJoinPatternCond(paramJson);
    const result = await PredictedPatternScore.findAll(condJson);
    if (result.length === 1) return result[0];
    else return result;
  },
  async getPredictedPatternScoreJoinPatternListPaging(paramJson) {
    const condJson = this.getPredictedPatternScoreJoinPatternCond(paramJson);
    condJson["PAGE"] = paramJson.page;
    const lineLimit = paramJson.boardLineLimit;
    paramJson["lineLimit"] = lineLimit;

    let result = {};
    let tot_cnt;

    await PredictedPatternScore.count(condJson)
      .then(function (cnt) {
        tot_cnt = cnt;
      })
      .catch(function (err) {
        // CommonService.handleError(err, req, res, req.transaction);
        result = false;
        return;
      });

    var paging = await CommonService.getPagingData(
      paramJson.page,
      tot_cnt,
      paramJson.lineLimit
    );

    condJson["order"] = sequelize.literal("predictedScore DESC");
    condJson["offset"] = paging.offset * lineLimit || 0; //시작 번호
    condJson["limit"] = lineLimit; //출력 row 수

    const patternList = await PredictedPatternScore.findAll(condJson);
    if (!patternList) return false;

    result["status"] = "Y";
    result["paging"] = paging;
    result["patternList"] = patternList;
    return result;
  },
  getPredictedPatternScoreJoinPatternCond(paramJson) {
    let condJson = {
      attributes: {
        include: [
          [sequelize.col("pattern.id"), "id"],
          [sequelize.col("pattern.downloadable"), "downloadable"],
          [sequelize.col("pattern.name"), "name"],
          [sequelize.col("pattern.notes"), "notes"],
          [sequelize.col("pattern.price"), "price"],
          [sequelize.col("pattern.currency"), "currency"],
          [sequelize.col("pattern.currencySymbol"), "currencySymbol"],
          [sequelize.col("pattern.author"), "author"],
          [sequelize.col("pattern.difficultyAverage"), "difficultyAverage"],
          [sequelize.col("pattern.rowGauge"), "rowGauge"],
          [sequelize.col("pattern.gauge"), "gauge"],
          [sequelize.col("pattern.gaugeDescription"), "gaugeDescription"],
          [sequelize.col("pattern.gaugeDivisor"), "gaugeDivisor"],
          [sequelize.col("pattern.url"), "url"],
          [sequelize.col("pattern.yardage"), "yardage"],
          [sequelize.col("pattern.thumbnail"), "thumbnail"],
          [sequelize.col("pattern.craft"), "craft"],
          [sequelize.col("pattern.type"), "type"],
        ],
      },
      include: [
        {
          model: Pattern,
          as: "pattern",
          attributes: [],
        },
      ],
      where: {},
      order: [["predictedScore", "DESC"]],
      raw: true,
    };
    if (paramJson.userId) condJson.where["userId"] = paramJson.userId;
    return condJson;
  },
  applyWhereCond(paramJson) {
    //
    let condJson = {
      raw: true,
      where: {},
      order: [["predictedScore", "DESC"]],
    };

    if (paramJson.userId) condJson.where["userId"] = paramJson.userId;
    return condJson;
  },
};
module.exports = PredictedPatternScoreController;
