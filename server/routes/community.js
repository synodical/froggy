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
    
    resJson['status'] = 'Y';
    return res.json(resJson);

});

router.get("/main", async (req, res, next) => {
    let resJson = { status: "N" };
    
    const postList = await CommunityService.getMainPosts();

    resJson["postList"] = postList;
    resJson["status"] = "Y";
    return res.json(resJson);
});

router.get("/post/:postId", async (req, res, next) => {
    let resJson = { status: "N" };
    const { postId } = req.params

    const postDetail =await CommunityService.getPostDetail(postId);

    if (CommonService.isEmpty(postDetail)) {
        return res.json(resJson);
    }

    resJson["postDetail"] = postDetail;
    resJson["status"] = "Y";
    return res.json(resJson);
});

router.get("/comment/:postId", async (req, res, next) => {
    let resJson = { status: "N" };
    const { postId } = req.params

    const commentList =await CommunityService.getCommentList(postId);

    resJson["commentList"] = commentList;
    resJson["status"] = "Y";
    return res.json(resJson);
});


router.post("/write/:postId/comment", async (req, res, next) => {
    let resJson = { status: "N" };
    const { postId } = req.params

    const  user  = req.user;
    if (CommonService.isEmpty(user)) {
        resJson['isUserLogin'] = 'N';
        return res.json(resJson);
    }

    const paramJson = {
        postId,
        user,
        comment: req.body.comment,
    }

    const postDetail =await CommunityService.saveComment(paramJson);

    if (CommonService.isEmpty(postDetail)) {
        return res.json(resJson);
    }

    resJson["postDetail"] = postDetail;
    resJson["status"] = "Y";
    return res.json(resJson);
});


module.exports = router;