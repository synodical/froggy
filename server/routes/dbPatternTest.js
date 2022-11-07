const express = require("express");

const { Pattern, Yarn, Image } = require("../models");
const SavePatternService = require("../services/save_pattern_service");
const CommonService = require("../common/common_service");
const PatternAttributeController = require("../controllers/pattern_attribute_controller");
const PatternController = require("../controllers/pattern_controller");
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resJson = { status: "N" };
  const { pattern } = req.body;
  if (pattern === undefined) {
    return res.json(resJson);
  }
  try {
    await PatternController.upsertPattern(pattern);
    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
