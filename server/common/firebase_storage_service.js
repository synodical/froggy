const firebaseConfig = require("../config/froggy-34371-firebase-adminsdk-gf2pi-54dd8356b9.json");
const firebase = require("firebase");
const admin = require("firebase-admin");
const firebaseAdmin = admin.initializeApp(
  {
    credential: admin.credential.cert(firebaseConfig),
  },
  "storage"
);
const storage = firebaseAdmin.storage();
const bucket = storage.bucket(`gs://froggy-34371.appspot.com`);

const FirebaseStorageService = {
  uploadPhotos: async function (req, res) {
    let fileUrlList = null;
    if (req.files) {
      console.log(req.files);
      let fileArr = req.files;
      fileUrlList = await FirebaseStorageService.getFileUrlList(req, res, {
        fileArr: fileArr,
      }).catch(function (err) {
        console.log(err);
      });
      console.log(fileArr);
    } else if (req.file) {
      var fileUrl = await FirebaseStorageService.uploadPhoto(req, res, {
        file: req.file,
      }).catch(function (err) {
        console.log(err);
      });
      fileUrlList = [fileUrl];
    }
    return fileUrlList;
  },
  getFileUrlList: async function (req, res, paramJson) {
    let fileArr = paramJson.fileArr;
    let fileUrlList = [];
    if (!fileArr) return null;
    for (let file of fileArr) {
      var downloadUrl = await FirebaseStorageService.uploadPhoto(req, res, {
        file: file,
      });
      fileUrlList.push(downloadUrl);
    }
    return fileUrlList;
  },
  uploadPhoto: async function (req, res, paramJson) {
    return new Promise(async function (resolve, reject) {
      let file = paramJson.file;
      if (!file) {
        reject("No image file");
      }
      let newFileName = `${file.originalname}_${Date.now()}`;
      let fileUpload = bucket.file(newFileName);
      const blobStream = fileUpload
        .createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        })
        .on("error", (error) => {
          console.log(error);
          reject(error);
        })
        .on("finish", async () => {
          const imageUrl =
            `https://firebasestorage.googleapis.com/v0/b/` +
            `froggy-34371.appspot.com/o/${newFileName}?alt=media`;
          resolve(imageUrl);
        });
      blobStream.end(file.buffer);
    });
  },
};
module.exports = FirebaseStorageService;
