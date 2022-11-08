const { User } = require("../models");

const ProfileController = {
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
};

module.exports = ProfileController;
