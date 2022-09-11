const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
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
    author,
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

  const downloadLocation = download_location.url;
  try {
    const patternId = pattern.id;
    const exPattern = await Pattern.findOne({
      where: { raverlyId: patternId },
    });
    if (exPattern) {
      return res.status(404);
    }
    await Pattern.create({
      raverlyId: id,
      downloadable: downloadable,
      downloadLocation: downloadLocation,
      name: name,
      notes: notes,
      price: price,
      currency: currency,
      currencySymbol: currency_symbol,
      author: author,
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

    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
