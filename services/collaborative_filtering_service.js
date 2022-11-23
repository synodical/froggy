const PatternController = require("../controllers/pattern_controller");
const PredictedPatternScoreController = require("../controllers/predicted_pattern_score_controller");
const { User, PatternReview, LikedPattern } = require("../models");

const FLASK_IP = require("../config/apps_ip").get("FLASK");
const request = require("request");
const LIKED_SCORE = 4;

const CollaborativeFilteringService = {
  async getRecommendAvailableUser() {
    let userScoreList = [];
    let userListForLevel1 = [];
    const userList = await User.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    for (let user of userList) {
      const reviewList = await PatternReview.findAll({
        where: {
          userId: user.id,
        },
        raw: true,
      });
      const likedList = await LikedPattern.findAll({
        where: {
          userId: user.id,
        },
        raw: true,
      });
      const rateCount = reviewList.length + likedList.length;
      if (rateCount > 30) {
        const payload = await this.genPayload(reviewList, likedList);
        userScoreList.push({ user: user.id, scoreList: payload });
        if (user.level < 1) {
          userListForLevel1.push(user);
        }
      }
    }
    let resJson = {
      userScoreList: userScoreList,
      userListForLevel1: userListForLevel1,
    };
    return resJson;
  },
  async genPayload(reviewList, likedList) {
    let payload = [];
    let idList = [];
    for (let review of reviewList) {
      idList.push(review.patternId);
      const pattern = await PatternController.getPatternList({
        id: review.patternId,
      });
      payload.push({
        id: pattern.raverlyId,
        score: review.rating,
      });
    }

    for (let liked of likedList) {
      if (!idList.includes(liked.patternId)) {
        const pattern = await PatternController.getPatternList({
          id: liked.patternId,
        });
        payload.push({
          id: pattern.raverlyId,
          score: LIKED_SCORE,
        });
      }
    }
    return payload;
  },
  sendUserScoreList: async function (paramJson) {
    const { userScoreList } = paramJson;
    return new Promise((resolve, reject) => {
      const option = {
        method: "post",
        url: `${FLASK_IP}/recommend`,
        // form: { userScoreList: userScoreList },
        body: {
          userScoreList: userScoreList,
        },
        json: true, //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
      };
      request.post(option, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body);
          console.log(response);
          let resList = body;
          // let resJson = JSON.parse(body);
          resolve(resList);
        } else {
          console.log(error);
          resolve(false);
        }
      });
    });
  },
  async saveRecommendResult(paramJson) {
    const { userId, recommendScoreList } = paramJson;
    for (let score of recommendScoreList) {
      await PredictedPatternScoreController.createPredictbyBulk({
        userId: userId,
        scoreList: score,
      });
    }
  },
};
module.exports = CollaborativeFilteringService;
