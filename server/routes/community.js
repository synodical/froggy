const express = require("express");
const router = express.Router();

const CommunityService = require("../controllers/community_service");
const CommonService = require("../common/common_service");


router.post("/write", async (req, res, next) => {
    let resJson = { status: "N" };
    const { title, contents } = req.body;
    const  user  = req.user;
    if (CommonService.isEmpty(user)) {
        return res.json(resJson);
    }
    await CommunityService.savePost({user,title,contents});


});

module.exports = router;