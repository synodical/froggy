
const { Post, Comment } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");

const CommunityService = {
    async savePost(data) {
        const { user, title, contents } = data;
        const paramJson = {
            userId: user.dataValues.id,
            userNick: user.dataValues.nick,
            category: '정보',
            title: title,
            contents: contents
        }   
        const insertResult = await Post.create(paramJson);
        return insertResult;
    },
    async getMainPosts(){
        const randPost = await Post.findAll({
            order: Sequelize.fn("RAND"),
            limit: 15, // limit으로 반환받을 row 수를 정할 수 있어요
            raw: true,
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
            disDel:'N',
        }   
        const insertResult = await Comment.create(paramJson);
        return insertResult;
    },
}

module.exports = CommunityService;