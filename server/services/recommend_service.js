const FLASK_IP = require("../config/apps_ip").get("FLASK");
const request = require("request");

const RecommendService = {
  getRecommendPattern: async function (req, res, paramJson) {
    //parmJson 에 이후에 필요한 파라미터 넣을것
    // user id, user liked pattern info 등..
    return new Promise((resolve, reject) => {
      const option = {
        url: `${FLASK_IP}/recommend`,
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

module.exports = RecommendService;
