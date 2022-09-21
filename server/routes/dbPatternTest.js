const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
const Image = require("../models").Image;
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resJson = { status: "N" };
  //console.log(req.body);
  const { pattern } = req.body;

  if (pattern === undefined) {
    return res.json(resJson);
  }
  const {
    id,
    downloadable,
    download_location,
    name,
    notes,
    price,
    currency,
    currency_symbol,
    pattern_author,
    difficulty_average,
    difficulty_count,
    rating_average,
    rating_count,
    row_gauge,
    gauge,
    gauge_divisor,
    url,
    yardage,
  } = req.body.pattern;
  let downloadUrl = null;
  let patternAuthorName = null;
  if (download_location !== null) {
    downloadUrl = download_location.url;
  }
  if (pattern_author !== null) {
    patternAuthorName = pattern_author.name;
  }
  try {
    const patternId = pattern.id;
    const exPattern = await Pattern.findOne({
      where: { raverlyId: patternId },
    });
    if (exPattern) {
      // console.log(exPattern);
      return res.json(resJson);
    }

    const insertResult = await Pattern.create({
      raverlyId: id,
      downloadable: downloadable,
      downloadLocation: downloadUrl,
      name: name,
      notes: notes,
      price: price,
      currency: currency,
      currencySymbol: currency_symbol,
      author: patternAuthorName,
      difficultyAverage: difficulty_average,
      difficultyCount: difficulty_count,
      ratingAverage: rating_average,
      ratingCount: rating_count,
      rowGauge: row_gauge,
      gauge: gauge,
      gaugeDivisor: gauge_divisor,
      url: url,
      yardage: yardage,
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
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
