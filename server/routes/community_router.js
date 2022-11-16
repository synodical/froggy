const express = require("express");
const router = express.Router();

const CommunityController = require("../controllers/community_controller");
const CommonService = require("../common/common_service");

router.post("/posts", async (req, res, next) => {
  let resJson = { status: "N" };
  const { title, contents } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await CommunityController.savePost({ user, title, contents });

  resJson["status"] = "Y";
  return res.json(resJson);
});

router.delete("/posts/:postId", async (req, res, next) => {
  let resJson = { status: "N" };
  const { postId } = req.params;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  await CommunityController.deletePost({ user, postId });

  resJson["status"] = "Y";
  return res.json(resJson);
});

router.get("/main", async (req, res, next) => {
  let resJson = { status: "N" };

  const postList = await CommunityController.getMainPosts();

  resJson["postList"] = postList;
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.get("/posts/:postId", async (req, res, next) => {
  let resJson = { status: "N" };
  const { postId } = req.params;

  const postDetail = await CommunityController.getPostDetail(postId);

  if (CommonService.isEmpty(postDetail)) {
    return res.json(resJson);
  }

  resJson["postDetail"] = postDetail;
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.get("/posts/:postId/comments", async (req, res, next) => {
  let resJson = { status: "N" };
  const { postId } = req.params;

  const commentList = await CommunityController.getCommentList(postId);

  resJson["commentList"] = commentList;
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.post("/posts/:postId/comments", async (req, res, next) => {
  let resJson = { status: "N" };
  const { postId } = req.params;

  const user = req.user;
  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }

  const paramJson = {
    postId,
    user,
    comment: req.body.comment,
  };

  const postDetail = await CommunityController.saveComment(paramJson);

  if (CommonService.isEmpty(postDetail)) {
    return res.json(resJson);
  }

  resJson["postDetail"] = postDetail;
  resJson["status"] = "Y";
  return res.json(resJson);
});

module.exports = router;
