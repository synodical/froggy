const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const Customer = require("../models").Customer;
const models = require("../models");
const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { customer_id, password, customer_nick } = req.body;
  try {
    const customer_pwd = password;
    const exCustomer = await Customer.findOne({ where: { customer_id } });
    if (exCustomer) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 15); // salt 알아서 햐줌
    await Customer.create({
      customer_id,
      customer_pwd: hash,
      customer_nick,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, customer, info) => {
    // 미들웨어가 로그인 전략을 수행함
    // passport는 req객체에 login과 logout 메서드를 추가
    // req.login이 passport.serializeUser를 호출합니다.
    // req.login에 제공하는 user 객체가 serializeUser로 넘어가게 됩니다.
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!customer) {
      console.log(info.message);
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(customer, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log(customer);
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
