const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
const router = express.Router();
const axios = require("axios");
const Customer = require("../models").Customer;
const models = require("../models");


router.post("/", async (req, res, next) => {
  let respJson = { status: 'N' };
  console.log(req.body);
  const { yarn } = req.body;

  if (yarn === undefined) {
    return res.status(400);
  }
  const gauge_divisor = yarn.gauge_divisor;
  const grams = yarn.grams;
  const id = yarn.id;
  const machine_washable = yarn.machine_washable;
  const name = yarn.name;
  const yardage = yarn.yardage;
  const yarn_company_name = yarn.yarn_company_name;
  try {
    const yarnId = yarn.id;
    const exYarn = await Yarn.findOne({ where: { id: yarnId } });
    if (exYarn) {
      return res.redirect("/join?error=exist");
    }
    await Yarn.create({
      gauge_divisor: gauge_divisor,
      grams: grams,
      id: id,
      machine_washable: machine_washable,
      name: name,
      yardage: yardage,
      yarn_company_name: yarn_company_name,
    });
    respJson['status'] = 'Y';
    return res.json(respJson)
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
