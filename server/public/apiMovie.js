const USER_SERVER = "/api/users";

const API_URL = "https://api.themovieDb.org/3/";
const APP_KEY = "aa08150e89c3b31405dee04169d7af68";
const IMAGE_BASE_URL = "http://image.tmdb.org/t/p/";

const endpoint = `${API_URL}movie/popular?api_key=${APP_KEY}&language=en-US&page=1`;

function button1_click() {
  console.log("버튼1을 누르셨습니다.");
}

if (document.readyState === "loading") {
  console.log("load page");
  document.addEventListener("DOMContentLoaded", function () {
    console.log("loaded");
    /*
    fetch(endpoint)
      .then((response) => response.json)
      .then((response) => console.log(response));
      */
  });
} else {
  console.log("Teste");
}
