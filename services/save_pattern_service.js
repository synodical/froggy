const SavePatternService = {
  getAttributeList(data) {
    let arr = [];
    for (let i of data) {
      arr.push(i.id);
    }
    return arr;
  },
};

module.exports = SavePatternService;
