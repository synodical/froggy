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
    return res.json(resJson);
  }
  const {
    gauge_divisor,
    grams,
    id,
    machine_washable,
    name,
    yardage,
    yarn_company_name,
  } = req.body.yarn;

  try {
    const yarnId = yarn.id;
    const exYarn = await Yarn.findOne({ where: { id: yarnId } });
    if (exYarn) {
      return res.status(404);
    }
    await Yarn.create({
      gaugeDivisor: gauge_divisor,
      grams: grams,
      raverlyId: id,
      machineWashable: machine_washable,
      name: name,
      yardage: yardage,
      yarnCompanyName: yarn_company_name,
    });

    resJson["status"] = "Y";
    return res.json(resJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
