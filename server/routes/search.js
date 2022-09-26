const { QueryTypes } = require("sequelize");

router.get("/", async (req, res, next) => {
  console.log(req.query);
  const keyword = req.query;
  keyword = keyword.replace(" ", "%"); // db에는 빨간실로 저장되어 있지만, 빨간 실로 검색한 경우
  // keyword = `%${keyword.replace(/ /gi, "%")}%`;
  const query =
    'select * from pattern where replace(name," ","") like :keyword or replace(author," ","") like :keyword';
  try {
            const searchList = await sequelize.query(query, {
                replacements: { searchText: searchText },
                type: QueryTypes.SELECT,
                raw: true,
            });

  } catch (err) {
    console.log(err)
    return next(err)
  }
  );
