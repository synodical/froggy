const { Liked, LikedPattern, LikedYarn } = require("../models");
const CommonService = require("../common/common_service");

const LikedController = {
  async savePatternLike(parmaJson) {
    try {
      const { user, patternId } = parmaJson;
      let exLiked = await LikedPattern.findOne({
        where: {
          patternId: patternId,
          userId: user.id,
        },
        paranoid: false,
        raw: true,
      });
      if (exLiked) {
        // 이미 존재하는 경우
        if (exLiked.deletedAt) {
          // 삭제되었던 경우
          LikedPattern.restore({
            where: {
              userId: user.id,
              patternId: patternId,
            },
            paranoid: false,
          });
        } else {
          // 삭제되지 않은 경우
          LikedPattern.destroy({
            where: {
              userId: user.id,
              patternId: patternId,
            },
          });
        }
      } else {
        LikedPattern.create({
          userId: user.id,
          patternId: patternId,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  async getLikedPatternIdList(paramJson) {
    const { user } = paramJson;
    const LikedPatternIdList = await LikedPattern.findAll({
      where: { userId: user.id },
      raw: true,
    });

    return LikedPatternIdList;
  },

  async saveYarnLike(parmaJson) {
    try {
      const { user, yarnId } = parmaJson;
      let exLiked = await LikedYarn.findOne({
        where: {
          yarnId: yarnId,
          userId: user.id,
        },
        paranoid: false,
        raw: true,
      });
      if (exLiked) {
        // 이미 존재하는 경우
        if (exLiked.deletedAt) {
          // 삭제되었던 경우
          LikedYarn.restore({
            where: {
              userId: user.id,
              yarnId: yarnId,
            },
            paranoid: false,
          });
        } else {
          // 삭제되지 않은 경우
          LikedYarn.destroy({
            where: {
              userId: user.id,
              yarnId: yarnId,
            },
          });
        }
      } else {
        LikedYarn.create({
          userId: user.id,
          yarnId: yarnId,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  async getLikedYarnIdList(paramJson) {
    const { user } = paramJson;
    const LikedYarnIdList = await LikedYarn.findAll({
      where: { userId: user.id },
      raw: true,
    });
    return LikedYarnIdList;
  },
  async isLiked(paramJson) {
    const { user, patternId } = paramJson;
    const exLiked = await LikedPattern.findOne({
      where: {
        userId: user.id,
        patternId: patternId,
      },
      raw: true,
    });
    return exLiked;
  },
};

module.exports = LikedController;
