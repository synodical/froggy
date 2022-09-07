const express = require("express");
const { request } = require("http");
const Yarn = require("../models").Yarn;
const Pattern = require("../models").Pattern;
const router = express.Router();
const axios = require("axios");

router.get("/dbTest", async (req, res, next) => {
  const { yarnData } = req.body;
});

module.exports = router;
