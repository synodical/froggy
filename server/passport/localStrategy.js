const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const Customer = require("../models").Customer;

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "customer_id",
        passwordField: "customer_pwd",
      },
      async (customer_id, customer_pwd, done) => {
        try {
          const exUser = await Customer.findOne({ where: { customer_id } });
          if (exUser) {
            const result = await bcrypt.compare(
              customer_pwd,
              exUser.customer_pwd
            );
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
