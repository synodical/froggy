const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const passport = require("passport");
const request = require("request");
const http = require("http");
const https = require("https");

//const axios = request("axios");
//const helmet = require("helmet");
const cors = require("cors");
const HTTPS_PORT = 8003;
const HTTP_PORT = 8002;

dotenv.config();
const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const yarnRouter = require("./routes/yarn");
const patternRouter = require("./routes/pattern");
const dbYarnTestRouter = require("./routes/dbYarnTest");
const dbPatternTestRouter = require("./routes/dbPatternTest");
const communityRouter = require("./routes/community");
const profileRouter = require("./routes/profile");
const imageRouter = require("./routes/image.js");

const { sequelize } = require("./models");
const User = require("./models").User;
const passportConfig = require("./passport");
const nodemon = require("nodemon");
const fs = require("fs");

const app = express();

passportConfig(); // 패스포트 설정
app.set("port", process.env.PORT || HTTP_PORT);

app.set("view engine", "html");
nunjucks.configure(path.join(__dirname, "views"), {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

https: app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      sameSite: "NONE",
      secure: "true",
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const safesitelist = ["http://localhost:8100"];

const corsOptions = {
  origin: function (origin, callback) {
    const issafesitelisted = safesitelist.indexOf(origin) !== -1;
    callback(null, issafesitelisted);
  },
  credentials: true,
};
//cors에 옵션사용할경우
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8100");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/yarn", yarnRouter);
app.use("/pattern", patternRouter);
app.use("/dbYarnTest", dbYarnTestRouter);
app.use("/dbPatternTest", dbPatternTestRouter);
app.use("/community", communityRouter);
app.use("/profile", profileRouter);
app.use("/image", imageRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const options = {
  key: fs.readFileSync("./config/localhost-key.pem"),
  cert: fs.readFileSync("./config/localhost.pem"),
};
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
//http.createServer(app).listen(HTTP_PORT);
https.createServer(options, app).listen(HTTPS_PORT);
//예으니바보
