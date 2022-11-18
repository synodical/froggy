const express = require("express");
const router = express.Router();

const CollaborativeFilteringService = require("../services/collaborative_filtering_service");
const UserController = require("../controllers/user_controller");
router.post("/", async (req, res, next) => {
  try {
    let resJson = { status: "N" };

    const { userScoreList, userListForLevel1 } =
      await CollaborativeFilteringService.getRecommendAvailableUser();
    const sendResult = await CollaborativeFilteringService.sendUserScoreList({
      userScoreList: userScoreList,
    });

    if (sendResult.length > 0) {
      for (let recommendScore of sendResult) {
        const userId = recommendScore[0];
        const score = recommendScore[1];
        const saveRecommendResult =
          await CollaborativeFilteringService.saveRecommendResult({
            userId: userId,
            recommendScoreList: score,
          });
      }
    }
    //새롭게 협업 필터링이 가능해진 유저의 정보를 update
    for (let user of userListForLevel1) {
      await UserController.updateUser(
        { level: 1 },
        {
          where: {
            id: user.id,
          },
        }
      );
    }
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
module.exports = router;
