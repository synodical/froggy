const PatternController = require("../controllers/pattern_controller");
const { User, PatternReview, LikedPattern } = require("../models");
const FLASK_IP = require("../config/apps_ip").get("FLASK");
const request = require("request");
const LIKED_SCORE = 4;

const CollaborativeFilteringService = {
  async getRecommendAvailableUser() {
    let userScoreList = [];
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
      }
    }
    return userScoreList;
  },
  async genPayload(reviewList, likedList) {
    let payload = [];
    for (let review of reviewList) {
      const pattern = await PatternController.getPatternList({
        id: review.patternId,
      });
      payload.push({
        id: pattern.raverlyId,
        score: review.rating,
      });
    }

    for (let liked of likedList) {
      const pattern = await PatternController.getPatternList({
        id: liked.patternId,
      });
      payload.push({
        id: pattern.raverlyId,
        score: LIKED_SCORE,
      });
    }
    return payload;
  },
  sendUserScoreList: async function (paramJson) {
    //parmJson 에 이후에 필요한 파라미터 넣을것
    // user id, user liked pattern info 등..
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
          let resJson = JSON.parse(body);
          resolve(resJson);
        } else {
          console.log(error);
          resolve(false);
        }
      });
    });
  },
};
module.exports = CollaborativeFilteringService;
