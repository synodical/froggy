const { PatternReviewImage, YarnReviewImage } = require("../models");
const { sequelize } = require("../models");

// service
const CommonService = require("../common/common_service");
const FirebaseStorageService = require("../common/firebase_storage_service");
const { param } = require("../routes/image_router");

const ReviewImageController = {
  async insertPatternReviewImage(req, res, paramJson) {
    try {
      const { patternId, patternReviewId, imagesData } = paramJson;
      if (imagesData.length > 0) {
        imageUrlList = await FirebaseStorageService.uploadPhotos(req, res);
        for (let i = 0; i < imagesData.length; i++) {
          const imageUrl = imageUrlList.find((url) =>
            url.includes(imagesData[i].originalname)
          );
          await PatternReviewImage.create({
            patternReviewId: patternReviewId,
            patternId: patternId,
            imageUrl: imageUrl,
          });
        }
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  },
  async getPatternImageList(patternReview) {
    const patternReviewImageList = await PatternReviewImage.findAll({
      where: {
        patternId: patternReview.patternId,
        patternReviewId: patternReview.id,
      },
      raw: true,
    });

    let imageList = [];
    if (!CommonService.isEmpty(patternReviewImageList)) {
      for (image of patternReviewImageList) {
        imageList.push(image.imageUrl);
      }
    }
    return imageList;
  },

  async insertYarnReviewImage(req, res, paramJson) {
    try {
      const { yarnId, yarnReviewId, imagesData } = paramJson;
      if (imagesData.length > 0) {
        imageUrlList = await FirebaseStorageService.uploadPhotos(req, res);
        for (let i = 0; i < imagesData.length; i++) {
          const imageUrl = imageUrlList.find((url) =>
            url.includes(imagesData[i].originalname)
          );
          await YarnReviewImage.create({
            yarnReviewId: yarnReviewId,
            yarnId: yarnId,
            imageUrl: imageUrl,
          });
        }
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  },
  async getYarnImageList(yarnReview) {
    const yarnReviewImageList = await YarnReviewImage.findAll({
      where: {
        yarnId: yarnReview.yarnId,
        yarnReviewId: yarnReview.id,
      },
      raw: true,
    });

    let imageList = [];
    if (!CommonService.isEmpty(yarnReviewImageList)) {
      for (image of yarnReviewImageList) {
        imageList.push(image.imageUrl);
      }
    }
    return imageList;
  },
};
module.exports = ReviewImageController;
