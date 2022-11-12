const { PatternReview, YarnReview } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");

const ReviewController = {
  async savePatternReview(data) {
    const { user, patternId, contents, rating } = data;
    const paramJson = {
      userId: user.dataValues.id,
      userNick: user.dataValues.nick,
      patternId: patternId,
      contents: contents,
      rating: rating,
    };
    const insertResult = await PatternReview.create(paramJson);
    return insertResult;
  },
  async getPatternReview() {
    const patternReview = await PatternReview.findAll({
      where: { patternId: patternId },
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    return patternReview;
  },
};
module.exports = ReviewController;
