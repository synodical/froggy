const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models").User;
const models = require("../models");
const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  let respJson = { status: "N" };
  const { id, email, password, nickname } = req.body;
  try {
    const exUser = await User.findOne({ where: { id } });
    if (exUser) {
      return res.json(respJson);
    }
    const hash = await bcrypt.hash(password, 15); // salt 알아서 햐줌
    const UserCreateResult = await User.create({
      id: id,
      email: email,
      password: hash,
      nick: nickname,
    });
    if (UserCreateResult) {
      return res.json(respJson);
    }
    respJson["status"] = "Y";
    return res.json(respJson);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    let resJson = { status: "N" };
    // 미들웨어가 로그인 전략을 수행함
    // passport는 req객체에 login과 logout 메서드를 추가
    // req.login이 passport.serializeUser를 호출합니다.
    // req.login에 제공하는 user 객체가 serializeUser로 넘어가게 됩니다.
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      console.log(info.message);
      return res.redirect(`/?loginError=${info.message}`);
    }
    if (user) {
      console.log("req.user ", JSON.stringify(user));
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log("user test??", user);
      resJson = { status: "Y" };
      resJson["user"] = user;
      return res.json(resJson);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  //req.logout();
  let resJson = { status: "N" };
  req.session.destroy();


  resJson['status'] = 'Y';
  res.json(resJson);
});

module.exports = router;
