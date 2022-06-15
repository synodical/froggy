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
          const img = data.pattern.photos[0].small_url;
          const url = data.pattern.url;
          document.getElementById(`yarn_img${i}`).src = img;
          document.getElementById(`yarn_url${i}`).href = url;
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
