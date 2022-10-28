
//const { Post } = require("../models/post");
const Post = require("../models").Post;
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
    }


}

module.exports = CommunityService;