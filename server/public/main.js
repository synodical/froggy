async function getImgList() {
  imageUrls = [];
  try {
    for (let i = 1234; i < 1238; i++) {
      const BASE_URI = "https://api.ravelry.com";
      const endpoint = `${BASE_URI}/patterns/${i}.json`;
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
          //const img = data.pattern.photos[0].square_url;
          const img = data;
          imageUrls.push(img);
          console.log(img);
        })
        .catch((err) => alert(err));
    }
    console.log(typeof imageUrls);
    console.log(imageUrls);
    return imageUrls;
  } catch (err) {
    console.error(err);
  }
}

document.onload = () => {
  if (new URL(location.href).searchParams.get("loginError")) {
    alert(new URL(location.href).searchParams.get("loginError"));
  }
};
