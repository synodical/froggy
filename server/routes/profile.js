const express = require("express");
const router = express.Router();

const CommonService = require("../common/common_service");
const ProfileService = require("../controllers/profile_service");

router.put("/nickname", async (req, res, next) => {
  let resJson = { status: "N" };
  const { newNickName } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await ProfileService.updateNickName({ user, newNickName });

  resJson["status"] = "Y";
  return res.json(resJson);
});

module.exports = router;
