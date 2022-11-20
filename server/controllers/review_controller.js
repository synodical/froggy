const { PatternReview, YarnReview } = require("../models");
const { sequelize } = require("../models");
const Sequelize = require("sequelize");

const ReviewImageController = require("../controllers/review_image_controller");

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
  async deletePatternReview(paramJson) {
    const { user, patternId } = paramJson;
    const deleteResult = await PatternReview.destroy({
      where: {
        userId: user.dataValues.id,
        patternId: patternId,
      },
    });
    return deleteResult;
  },
  async getPatternReview(patternId) {
    const patternReviewList = await PatternReview.findAll({
      where: { patternId: patternId },
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    for (let patternReview of patternReviewList) {
      patternReview["imageList"] =
        await ReviewImageController.getPatternImageList(patternReview);
    }
    return patternReviewList;
  },
  async getPatternReviewByUser(paramJson) {
    const { user } = paramJson;

    const patternReviewList = await PatternReview.findAll({
      where: { userId: user.id },
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    for (let patternReview of patternReviewList) {
      patternReview["imageList"] =
        await ReviewImageController.getPatternImageList(patternReview);
    }
    return patternReviewList;
  },
  async isPatternReviewed(paramJson) {
    const { user, patternId } = paramJson;
    const exReview = await PatternReview.findOne({
      where: {
        userId: user.id,
        patternId: patternId,
      },
      raw: true,
    });
    return exReview;
  },
  // 여기서부터 yarn review에 관한 컨트롤러
  async saveYarnReview(data) {
    const { user, yarnId, contents, rating } = data;
    const paramJson = {
      userId: user.dataValues.id,
      userNick: user.dataValues.nick,
      yarnId: yarnId,
      contents: contents,
      rating: rating,
    };
    const insertResult = await YarnReview.create(paramJson);
    return insertResult;
  },
  async deleteYarnReview(paramJson) {
    const { user, yarnId } = paramJson;
    const deleteResult = await YarnReview.destroy({
      where: {
        userId: user.dataValues.id,
        yarnId: yarnId,
      },
    });
    return deleteResult;
  },
  async getYarnReview(yarnId) {
    const yarnReviewList = await YarnReview.findAll({
      where: { yarnId: yarnId },
      raw: true,
      order: [["createdAt", "DESC"]],
    });
    for (let yarnReview of yarnReviewList) {
      yarnReview["imageList"] = await ReviewImageController.getYarnImageList(
        yarnReview
      );
    }
    return yarnReviewList;
  },
  async getYarnReviewByUser(paramJson) {
    const { user } = paramJson;

    const yarnReviewList = await YarnReview.findAll({
      where: { userId: user.id },
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    for (let yarnReview of yarnReviewList) {
      yarnReview["imageList"] = await ReviewImageController.getYarnImageList(
        yarnReview
      );
    }

    return yarnReviewList;
  },
  async isYarnReviewed(paramJson) {
    const { user, yarnId } = paramJson;
    const exReview = await YarnReview.findOne({
      where: {
        userId: user.id,
        yarnId: yarnId,
      },
      raw: true,
    });
    return exReview;
  },
};
module.exports = ReviewController;
