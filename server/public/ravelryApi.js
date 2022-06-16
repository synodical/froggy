const BASE_URI = "https://api.ravelry.com";
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

async function getPatternImgList() {
  let mainImgNum = 15;
  let iter = 0;
  let endpoint;
  let tmpId;
  while (iter < mainImgNum) {
    try {
      tmpId = getRandomInt(1, 10000);
      endpoint = `${BASE_URI}/patterns/${tmpId}.json`;
      fetch(endpoint, { method: "GET", headers: headers })
        .then((res) => res.json())
        .then((data) => {
          let img = data.pattern.photos[0].small_url;
          let url = data.pattern.url;
          const pattern_section = document.getElementById("pattern_section");
          pattern_section.innerHTML += `<a href="${url}">
  <img src="${img}" alt="pic of pattern"
  class="mx-2 my-2"
  id="patternImageUrl${tmpId}" />
  </a>`;
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
    iter++;
  }
}

async function getYarnImgList() {
  let mainImgNum = 15;
  let iter = 0;
  let endpoint;
  let tmpId;
  while (iter < mainImgNum) {
    try {
      tmpId = getRandomInt(1, 10000);
      endpoint = `${BASE_URI}/yarns/${tmpId}.json`;
      fetch(endpoint, { method: "GET", headers: headers })
        .then((res) => res.json())
        .then((data) => {
          let img = data.yarn.photos[0].small_url;
          let url = data.yarn.url;
          const yarn_section = document.getElementById("yarn_section");
          yarn_section.innerHTML += `<a href="${url}">
  <img src="${img}" alt="pic of yarn" 
   style=" " class="mx-2 my-2"
  id="yarnImageUrl${tmpId}" />
</a>`;
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
    iter++;
  }
}

document.onload = () => {
  if (new URL(location.href).searchParams.get("loginError")) {
    alert(new URL(location.href).searchParams.get("loginError"));
  }
};
