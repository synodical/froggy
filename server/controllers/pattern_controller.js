const { Pattern, Image } = require("../models");
const CommonService = require("../common/common_service");

// include controller
const PatternAttributeController = require("../controllers/pattern_attribute_controller");
const PatternCategoryController = require("../controllers/pattern_category_controller");

const SavePatternService = require("../services/save_pattern_service");

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

    const updateResult = await Pattern.update(
      {
        attributeIdArr: attributeArr.join(","),
        craft: newPattern.craft.name,
        categoryId: newPattern.pattern_categories[0].id,
        type: newPattern.pattern_type.permalink,
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
};

module.exports = PatternController;
