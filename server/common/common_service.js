const CommonService = {
    isEmpty: function (value) {
    // js 빈값체크 0, "", undefined, [], {}
    if (
      (typeof value == 'number' && isNaN(value)) ||
      value == '' ||
      value == null ||
      value == undefined ||
      (value != null && typeof value == 'object' && !Object.keys(value).length)
    ) {
      return true;
    } else {
      return false;
    }
  },


}

module.exports = CommonService;