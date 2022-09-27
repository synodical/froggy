const express = require("express");
const { QueryTypes } = require("sequelize");
const { Pattern, sequelize } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  let keyword = req.query[0];
  console.log(keyword);
  keyword = keyword.toString().replace(" ", "%"); // db에는 빨간실로 저장되어 있지만, 빨간 실로 검색한 경우
  // keyword = `%${keyword.replace(/ /gi, "%")}%`;
  const query =
    // 'select * from pattern where replace(name," ","") like :keyword or replace(author," ","") like :keyword';
    `select * from pattern where name like '%${keyword}%' or author like '%${keyword}%'`;
  try {
    const searchList = await sequelize.query(query, {
      replacements: { keyword: keyword },
      type: QueryTypes.SELECT,
      raw: true,
    });
    if (searchList.length == 0) {
      res.status(204).json({
        message: "No results or fail",
      });
    } else {
      res.status(200).json({
        searchList: searchList,
      });
      //console.log(searchList);
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

module.exports = router;
