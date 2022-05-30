async function getImgList() {
  try {
    const imgs = await axios.get("https://picsum.photos/v2/list");
    let urls = [];
    for (let i = 0; i < imgs.data.length; i++) {
      urls.push(imgs.data[i].download_url);
    }
    return urls;
  } catch (err) {
    console.error(err);
  }
}
