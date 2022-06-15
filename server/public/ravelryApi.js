async function getPatternImgList() {
  imageUrls = [];
  try {
    for (let i = 1234; i < 1239; i++) {
      const BASE_URI = "https://api.ravelry.com";
      const endpoint = `${BASE_URI}/patterns/${i}.json`;
      const headers = new Headers(); // 인증
      headers.append(
        "Authorization",
        "Basic " +
          btoa(
            "read-ea6b8e0a978e097b8badec466c71a60b" +
              ":" +
              "nKTdyxY5v3mF3TDb8hkQHGhHwHNQL7lbJtU8Dz15"
          )
      );
      fetch(endpoint, { method: "GET", headers: headers })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.pattern.id);
          let url = data.pattern.photos[0].square_url;
          let id = data.pattern.id;
          const pattern_section = document.getElementById("pattern_section");
          pattern_section.innerHTML += `<img src="${url}" alt="pics of yarn" width="180" height="180" id="yarnImageUrl${id}" />`;
        })
        .catch((err) => alert(err));
    }
  } catch (err) {
    console.error(err);
  }
}

async function getImg(num) {
  try {
    let img;
    const BASE_URI = "https://api.ravelry.com";
    const endpoint = `${BASE_URI}/patterns/${num + 1234}.json`;
    //인증을 위한 헤더
    const headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " +
        btoa(
          "read-ea6b8e0a978e097b8badec466c71a60b" +
            ":" +
            "nKTdyxY5v3mF3TDb8hkQHGhHwHNQL7lbJtU8Dz15"
        )
    );
    fetch(endpoint, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((data) => {
        img = data;
        console.log("fetch 종료1", img);
      })
      .catch((err) => alert(err));
  } catch (err) {
    console.error(err);
  }
}

document.onload = () => {
  if (new URL(location.href).searchParams.get("loginError")) {
    alert(new URL(location.href).searchParams.get("loginError"));
  }
};
