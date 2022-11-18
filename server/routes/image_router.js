const express = require("express");
const router = express.Router();
const multer = require("multer"); //
const FirebaseStorageService = require("../common/firebase_storage_service");
const CommonService = require("../common/common_service");
const UserController = require("../controllers/user_controller");
const sharp = require("sharp");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // no larger than 20mb, you can change as needed.
  },
});
router.post("/single", upload.single("image"), async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    const { file } = req.body;
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      resJson["reason"] = "다시 로그인 해주세요";
      return res.json(resJson);
    }
    const imageUrlList = await FirebaseStorageService.uploadPhotos(req, res);
    resJson["imageUrlList"] = imageUrlList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
