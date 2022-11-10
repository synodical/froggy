const express = require("express");
const router = express.Router();
const multer = require("multer"); //
const FirebaseStorageService = require("../common/firebase_storage_service");
const CommonService = require("../common/common_service");
const UserController = require("../controllers/user_controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // no larger than 20mb, you can change as needed.
  },
});
router.post("/single", upload.single("image"), async (req, res, next) => {
  let resJson = { status: "N" };
  const { file } = req.body;
  const user = req.user;
  let imageUrlList = [];

  imageUrlList = await FirebaseStorageService.uploadPhotos(req, res);

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await UserController.updateNickName({ user, newNickName });
  resJson["imageUrlList"] = imageUrlList;
  resJson["status"] = "Y";
  return res.json(resJson);
});
module.exports = router;
