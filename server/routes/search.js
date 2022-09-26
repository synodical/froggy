const { QueryTypes } = require("sequelize");
const { Pattern } = require("../models");
router.get("/", async (req, res, next) => {
  console.log(req.query);
  const keyword = req.query;
  keyword = keyword.replace(" ", "%"); // db에는 빨간실로 저장되어 있지만, 빨간 실로 검색한 경우
  // keyword = `%${keyword.replace(/ /gi, "%")}%`;
  const query =
    'select * from pattern where replace(name," ","") like :keyword or replace(author," ","") like :keyword';
  try {
    const searchList = await Pattern.query(query, {
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
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
});
