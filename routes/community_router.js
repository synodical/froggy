const express = require("express");
const router = express.Router();

const CommunityController = require("../controllers/community_controller");
const CommonService = require("../common/common_service");

router.get("/main", async (req, res, next) => {
  // 나중에 posts로 이름 바꾸고싶다
  let resJson = { status: "N" };

  const postList = await CommunityController.getAllPosts();

  resJson["postList"] = postList;
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.post("/posts", async (req, res, next) => {
  let resJson = { status: "N" };
  const { title, category, contents, htmlContents } = req.body;
  const user = req.user;

  if (CommonService.isEmpty(user)) {
    resJson["isUserLogin"] = "N";
    return res.json(resJson);
  }
  await CommunityController.savePost({
    user,
    title,
    category,
    contents,
    htmlContents,
  });
  resJson["status"] = "Y";
  return res.json(resJson);
});

router.get("/list", async (req, res, next) => {
  let resJson = { status: "N" };
  try {
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const postList = await CommunityController.getPostListByUser({ user });
    resJson["postList"] = postList;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/categories/:category", async (req, res, next) => {
  let resJson = { status: "N" };
  const { category } = req.params;
  const postList = await CommunityController.getPosts(category);

  resJson["postList"] = postList;
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

router.delete("/posts/:postId/comments/:commentId", async (req, res, next) => {
  try {
    let resJson = { status: "N" };
    console.log(req.params);
    const { commentId } = req.params;

    console.log(commentId);
    const user = req.user;
    if (CommonService.isEmpty(user)) {
      resJson["isUserLogin"] = "N";
      return res.json(resJson);
    }
    const deleteResult = await CommunityController.deleteComment({
      user,
      commentId,
    });
    if (CommonService.isEmpty(deleteResult)) {
      return res.json(resJson);
    }
    resJson["deleteResult"] = deleteResult;
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = router;
