const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res, next) => {
  console.log(req.body);
  const { yarnData } = req.body;
});

module.exports = router;
