const { Post, Comment } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");
const CommonService = require("../common/common_service");

const CommunityController = {
  async savePost(paramJson) {
    const { user, title, category, contents, htmlContents } = paramJson;
    const newPost = {
      userId: user.dataValues.id,
      userNick: user.dataValues.nick,
      category: category,
      title: title,
      contents: contents,
      htmlContents: htmlContents,
    };
    const insertResult = await Post.create(newPost);
    return insertResult;
  },
  async deleteComment(data) {
    let resJson = { status: "N" };
    const { user, commentId } = data;
    const comment = await Comment.findOne({ where: { id: commentId } });
    if (!CommonService.isEmpty(comment) && user.id == comment.userId) {
      const deleteResult = await Comment.destroy({
        where: {
          id: commentId,
        },
      });
      resJson["status"] = "Y";
      return resJson;
    } else {
      resJson["reason"] = "fail to delete post";
      return false;
    }
  },
  async deletePost(data) {
    let resJson = { status: "N" };
    const { user, postId } = data;
    const post = await Post.findOne({
      where: {
        id: postId,
      },
    });
    if (!CommonService.isEmpty(post) && user.id == post.userId) {
      const deletePostResult = await Post.destroy({
        where: {
          userId: user.id,
          id: postId,
        },
      });
      const deleteCommentResult = await Comment.destroy({
        where: {
          postId: postId,
        },
      });
      resJson["status"] = "Y";
      return resJson;
    } else {
      resJson["reason"] = "fail to delete post";
      return false;
    }
  },
  async getAllPosts() {
    const posts = await Post.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    for (let post of posts) {
      const postId = post["id"];
      const commentCnt = await Comment.count({
        where: { postId: postId },
        raw: true,
      });
      post["commentCnt"] = commentCnt;
    }
    return posts;
  },
  async getPosts(category) {
    const posts = await Post.findAll({
      where: {
        category: category,
      },
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    for (let post of posts) {
      const postId = post["id"];
      const commentCnt = await Comment.count({
        where: { postId: postId },
        raw: true,
      });
      post["commentCnt"] = commentCnt;
    }
    return posts;
  },
  async getPostDetail(postId) {
    const postDetail = await Post.findOne({
      where: {
        id: postId,
      },
      paranoid: false,
      raw: true,
    });
    return postDetail;
  },
  async getCommentList(postId) {
    const CommentList = await Comment.findAll({
      where: {
        postId: postId,
      },
      raw: true,
    });
    return CommentList;
  },
  async saveComment(data) {
    const { postId, user, comment } = data;

    const paramJson = {
      postId: postId,
      userId: user.dataValues.id,
      userNick: user.dataValues.nick,
      contents: comment,
      depth: 0,
      bundleId: 0,
      bundleOrder: 0,
    };

    const insertResult = await Comment.create(paramJson);
    return insertResult;
  },
  async getPostListByUser(paramJson) {
    const { user } = paramJson;
    const WrittenPostList = await Post.findAll({
      where: { userId: user.id },
      raw: true,
    });
    return WrittenPostList;
  },
};
module.exports = CommunityController;
