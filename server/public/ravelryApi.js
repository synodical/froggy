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
          let url = data.pattern.photos[0].small_url;
          let id = data.pattern.id;
          const pattern_section = document.getElementById("pattern_section");
          pattern_section.innerHTML += `<img src="${url}" alt="pic of pattern" class="mx-1 my-2" height="160" id="patternImageUrl${id}" />`;
        })
        .catch((err) => alert(err));
    }
  } catch (err) {
    console.error(err);
  }
}

async function getYarnImgList() {
  imageUrls = [];
  try {
    for (let i = 560; i < 570; i++) {
      const BASE_URI = "https://api.ravelry.com";
      const endpoint = `${BASE_URI}/yarns/${i}.json`;
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
          let url = data.yarn.photos[0].small_url;
          let id = data.yarn.id;
          const yarn_section = document.getElementById("yarn_section");
          yarn_section.innerHTML += `<img src="${url}" alt="pic of yarn" class="mx-1 my-2" height="160" id="yarnImageUrl${id}" />`;
        })
        .catch((err) => alert(err));
    }
  } catch (err) {
    console.error(err);
  }
}

document.onload = () => {
  if (new URL(location.href).searchParams.get("loginError")) {
    alert(new URL(location.href).searchParams.get("loginError"));
  }
};
