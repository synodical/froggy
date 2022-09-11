const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
const router = express.Router();

router.post("/", async (req, res, next) => {
  let resJson = { status: "N" };
  //console.log(req.body);
  const { yarn } = req.body;

  if (yarn === undefined) {
    return res.status(404);
  }
  const {
    gaugeDivisor,
    grams,
    id,
    machineWashable,
    name,
    yardage,
    yarnCompanyName,
  } = req.body.yarn;

  try {
    const yarnId = yarn.id;
    const exYarn = await Yarn.findOne({ where: { id: yarnId } });
    if (exYarn) {
      return res.status(404);
    }
    await Yarn.create({
      gaugeDivisor: gaugeDivisor,
      grams: grams,
      raverlyId: id,
      machineWashable: machineWashable,
      name: name,
      yardage: yardage,
      yarnCompanyName: yarnCompanyName,
    });

    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
