const PatternService = {
  async addLikedInfo(pattern, user) {
    const eachLiked = await Liked.findOne({
      where: {
        targetType: "pattern",
        targetId: pattern.id,
        userId: user.id,
      },
    });

    if (eachLiked === null) {
      pattern["liked"] = "N";
    } else {
      pattern["liked"] = "Y";
    }
    return pattern;
  },
};

module.exports = PatternService;
