const CommonService = {
  isEmpty: function (value) {
    // js 빈값체크 0, "", undefined, [], {}
    if (
      (typeof value == "number" && isNaN(value)) ||
      value == "" ||
      value == null ||
      value == undefined ||
      (value != null && typeof value == "object" && !Object.keys(value).length)
    ) {
      return true;
    } else {
      return false;
    }
  },
  getPagingData: function (page, tot_cnt, BOARD_LINE_LIMIT) {
    //def pagenum
    if (page == null) {
      page = 1;
    }
    const curpage = parseInt(page); //현재페이지
    const page_size = BOARD_LINE_LIMIT; //한 페이지당 게시물 수
    const page_list_size = 10; //전체 페이지 단위
    const page_limit = Math.ceil(page_list_size / 2); //전체 페이지 수
    let no = ""; //limit 변수
    const total_page = Math.ceil(tot_cnt / page_size); //전체 페이지 수
    const start_page = curpage - page_limit < 0 ? 1 : curpage - page_limit;
    const end_page =
      curpage + page_limit > total_page ? total_page : curpage + page_limit;

    //현재 페이지가 0보다 작으면
    if (curpage < 0) {
      no = 0;
    } else {
      //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
      no = curpage - 1; // * 10
    }

    const result = {
      curPage: curpage,
      page_list_size: page_list_size,
      page_size: page_size,
      totalPage: total_page,
      offset: no,
      startPage: start_page,
      endPage: end_page,
      tot_cnt: tot_cnt,
    };
    return result;
  },
};

module.exports = CommonService;
