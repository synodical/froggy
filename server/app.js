const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");

dotenv.config();
const pageRouter = require("./routes/page");

const authRouter = require("./routes/auth");
const apiTestRouter = require("./routes/apiTest");

const { sequelize } = require("./models");
const Customer = require("./models").Customer;
const passportConfig = require("./passport");
const testRouter = require("./routes/apiTest");

const app = express();

passportConfig(); // 패스포트 설정
app.set("port", process.env.PORT || 8002);

app.set("view engine", "html");
nunjucks.configure("views", {
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

const cspOptions = {
  directives: {
    // 기본 옵션을 가져옵니다.
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),

    // 구글 API 도메인과 인라인된 스크립트를 허용합니다.
    "script-src": ["'self'", "'unsafe-inline'", "https://api.raverly.com"],
    "connect-src": ["'self'", "'unsafe-inline'", "https://api.raverly.com"],
    // 리그오브레전드 사이트의 이미지 소스를 허용합니다.
    "img-src": ["'self'", "data:", "*.leagueoflegends.com"],
  },
};

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/apiTest", apiTestRouter);


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

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
