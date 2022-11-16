const { Post, Comment } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");
const CommonService = require("../common/common_service");

const CommunityController = {
  async savePost(data) {
    const { user, title, contents } = data;
    const paramJson = {
      userId: user.dataValues.id,
      userNick: user.dataValues.nick,
      category: "정보",
      title: title,
      contents: contents,
    };
    const insertResult = await Post.create(paramJson);
    return insertResult;
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
      const deleteResult = await Post.destroy({
        where: {
          userId: user.id,
          id: postId,
        },
      }).then(() => {
        Comment.destroy({
          where: {
            postId: postId,
          },
        });
      });
      resJson["status"] = "Y";
      return resJson;
    } else {
      resJson["reason"] = "fail to delete post";
      return false;
    }
  },
  async getMainPosts() {
    const randPost = await Post.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    return randPost;
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
      paranoid: false,
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
      disDel: "N",
    };
    const insertResult = await Comment.create(paramJson);
    return insertResult;
  },
};
module.exports = CommunityController;
