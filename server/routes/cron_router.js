const express = require("express");
const router = express.Router();

const CollaborativeFilteringService = require("../services/collaborative_filtering_service");

router.post("/", async (req, res, next) => {
  try {
    let resJson = { status: "N" };

    const userScoreList =
      await CollaborativeFilteringService.getRecommendAvailableUser();
    const sendResult = await CollaborativeFilteringService.sendUserScoreList({
      userScoreList: userScoreList,
    });

    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
module.exports = router;
