const { Pattern, Image } = require("../models");
const CommonService = require("../common/common_service");
const sequelize = require("sequelize");
const Op = sequelize.Op;

// include controller
const PatternAttributeController = require("../controllers/pattern_attribute_controller");
const PatternCategoryController = require("../controllers/pattern_category_controller");

const SavePatternService = require("../services/save_pattern_service");
const { del } = require("request");
const pattern = require("../models/pattern");

const PatternController = {
  async upsertPattern(pattern) {
    const PatternResult = await Pattern.findOne({
      where: { raverlyId: pattern.id },
      raw: true,
    });
    if (!CommonService.isEmpty(PatternResult)) {
      await this.updatePattern({
        newPattern: pattern,
        oldPattern: PatternResult,
      });
    } else {
      await this.insertPattern({ pattern: pattern });
    }
    return false;
  },

  async updatePattern(paramJson) {
    const { newPattern, oldPattern } = paramJson;
    const attributeArr = SavePatternService.getAttributeList(
      newPattern.pattern_attributes
    );
    // pattern attribute 테이블에 정보 저장
    for (let attribute of newPattern.pattern_attributes) {
      const savePatternAttribute =
        await PatternAttributeController.insertPatternAttribute(attribute);
    }

    //2. pattern category 테이블에 정보 저장
    const savePatternCategoryResult =
      await PatternCategoryController.insertPatternCategory({
        patternCategory: newPattern.pattern_categories,
      });

    let imageUrl = "";
    for (photo of newPattern.photos) {
      if (photo.medium_url) {
        imageUrl = photo.medium_url;
        break;
      }
    }
    const updateResult = await Pattern.update(
      {
        attributeIdArr: attributeArr.join(","),
        craft: newPattern.craft.name,
        categoryId: newPattern.pattern_categories[0].id,
        type: newPattern.pattern_type.permalink,
        gaugeDescription: newPattern.gauge_description,
        thumbnail: imageUrl,
      },
      {
        where: { id: oldPattern.id },
      }
    );
    return updateResult;
  },
  async insertPattern(paramJson) {
    const { pattern } = paramJson;

    const { download_location, pattern_author, pattern_attributes } = pattern;
    let downloadUrl = null;
    let patternAuthorName = null;

    if (download_location !== null) {
      downloadUrl = download_location.url;
    }
    if (pattern_author !== null) {
      patternAuthorName = pattern_author.name;
    }

    const attributeArr =
      SavePatternService.getAttributeList(pattern_attributes);

    for (let attribute of pattern_attributes) {
      const savePatternAttribute =
        await PatternAttributeController.insertPatternAttribute(attribute);
    }

    const insertResult = await Pattern.create({
      raverlyId: pattern.id,
      downloadable: pattern.downloadable,
      downloadLocation: downloadUrl,
      name: pattern.name,
      notes: pattern.notes,
      price: pattern.price,
      currency: pattern.currency,
      currencySymbol: pattern.currency_symbol,
      author: patternAuthorName,
      difficultyAverage: pattern.difficulty_average,
      difficultyCount: pattern.difficulty_count,
      ratingAverage: pattern.rating_average,
      ratingCount: pattern.rating_count,
      rowGauge: pattern.row_gauge,
      gauge: pattern.gauge,
      gaugeDivisor: pattern.gauge_divisor,
      url: pattern.url,
      yardage: pattern.yardage,
      attributeIdArr: attributeArr.join(","),
      craft: pattern.craft.name,
      categoryId: pattern.pattern_categories[0].id,
      type: pattern.pattern_type.permalink,
      gaugeDescription: pattern.gauge_description,
    });

    for (let photo of pattern.photos) {
      //console.log(photo.square_url);
      const imageInsertResult = await Image.create({
        targetType: "pattern",
        targetId: insertResult.dataValues.id,
        squareUrl: photo.square_url,
        mediumUrl: photo.medium_url,
        shelvedUrl: photo.shelved_url,
      });
    }
    return insertResult;
  },
  async getPatternWithImage(paramJson) {
    const condJson = this.applyWhereCond(paramJson);
    const patternResult = await Pattern.findOne(condJson);
    if (patternResult === null) {
      return false;
    }
    if (CommonService.isEmpty(patternResult.mediumUrl)) {
      const images = await Image.findAll({
        where: {
          targetType: "pattern",
          targetId: patternResult.id,
        },
        raw: true,
      });
      for (let image of images) {
        if (!CommonService.isEmpty(image.mediumUrl)) {
          patternResult["thumbnail"] = images[0].mediumUrl;
          return patternResult;
        }
      }
    }
    patternResult["thumbnail"] = "";
    return patternResult;
  },
  async getPatternList(paramJson) {
    //pattern list 반환하나, 1개일때는 그냥 하나를 반환
    const condJson = this.applyWhereCond(paramJson);
    const patternResult = await Pattern.findAll(condJson);
    if (patternResult.length === 1) return patternResult[0];
    else return patternResult;
  },
  applyWhereCond(paramJson) {
    // paramJson : {}
    // maxDifficulty : 조회하고 싶은 난이도의 최대
    // minDifficulty : 조회하고 싶은 난이도의 최저
    let condJson = {
      raw: true,
      where: {},
      order: [["difficultyAverage", "DESC"]],
    };
    if (paramJson.id) condJson.where["id"] = paramJson.id;
    if (paramJson.raverlyId) condJson.where["raverlyId"] = paramJson.raverlyId;
    if (
      paramJson.maxDifficulty &&
      (paramJson.minDifficulty || paramJson.minDifficulty === 0)
    )
      condJson.where["difficultyAverage"] = {
        [Op.lt]: paramJson.maxDifficulty,
        [Op.gt]: paramJson.minDifficulty,
      };
    if (paramJson.craft) condJson.where["craft"] = paramJson.craft;
    return condJson;
  },
  // async deletePattern(paramJson) {
  //   const { importantList } = paramJson;
  //   await Pattern.destroy({
  //     where: {
  //       raverlyId: { [Op.notIn]: importantList },
  //     },
  //     force: true,
  //   });
  // },
  // async deleteImage(paramJson) {
  //   const { importantList } = paramJson;
  //   const leftPattern = await Pattern.findAll({
  //     raw: true,
  //   });
  //   let leftPatternIdList = [];
  //   for (let el of leftPattern) {
  //     leftPatternIdList.push(el.id);
  //   }
  //   const tmpImage = await Image.findAll({
  //     where: {
  //       targetType: "pattern",
  //       targetId: { [Op.notIn]: leftPatternIdList },
  //     },
  //   });

  //   await Image.destroy({
  //     where: {
  //       targetType: "pattern",
  //       targetId: { [Op.notIn]: leftPatternIdList },
  //     },
  //     force: true,
  //   });
  // },
};

module.exports = PatternController;
