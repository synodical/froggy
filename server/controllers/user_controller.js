const { User } = require("../models");

const UserController = {
  async updateNickName(data) {
    const { user, newNickName } = data;

    const updateResult = await User.update(
      {
        nick: newNickName,
      },
      {
        where: { id: user.id },
      }
    );
    return updateResult;
  },
  async updateUser(paramJson, condJson) {
    let result = {};

    await User.update(paramJson, condJson)
      .then(function (updateCnt) {
        if (updateCnt === 0) throw new Error("User update Error");
        result = updateCnt;
      })
      .catch(function (err) {
        result = false;
      });
    return result;
  },
  applyWhereCond(paramJson) {
    let condJson = {
      raw: true,
    };
    if (paramJson.id) condJson.where["id"] = paramJson.id;
    if (paramJson.nick) condJson.where["nick"] = paramJson.nick;
    if (paramJson.proficiency)
      condJson.where["proficiency"] = paramJson.proficiency;
    if (paramJson.crochet) condJson.where["crochet"] = paramJson.crochet;
    if (paramJson.knitting) condJson.where["knitting"] = paramJson.knitting;
    return condJson;
  },
};

module.exports = UserController;
