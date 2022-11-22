const express = require("express");
const router = express.Router();

const CommonService = require("../common/common_service");
const UserController = require("../controllers/user_controller");

router.put("/", async (req, res, next) => {
  let resJson = { status: "N", isSetProfileChanged: "N" };
  const { newPrefer } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  let queryJson = {};
  if (newPrefer.proficiency !== -1)
    queryJson["proficiency"] = newPrefer.proficiency;
  if (newPrefer.crochet !== -1) queryJson["crochet"] = newPrefer.crochet;
  if (newPrefer.knitting !== -1) queryJson["knitting"] = newPrefer.knitting;

  await UserController.updateUser(queryJson, {
    where: {
      id: user.id,
    },
  });

  if (user.isSetProfile === "N") {
    await UserController.updateIsSetProfileY({ user: user });
    resJson["isSetProfileChanged"] = "Y";
  }

  // resJson["user"] = req.user;
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.put("/nickname", async (req, res, next) => {
  let resJson = { status: "N" };
  const { newNickName } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await UserController.updateNickName({ user, newNickName });

  resJson["status"] = "Y";
  return res.json(resJson);
});

router.put("/attribute", async (req, res, next) => {
  let resJson = { status: "N" };
  const { attributeList } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await UserController.updateFavoritePatternAttributeIdArr({
    user,
    FavoritePatternAttributeList: attributeList,
  });

  resJson["status"] = "Y";
  return res.json(resJson);
});
module.exports = router;
