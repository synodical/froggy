const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models").User;

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "id",
        passwordField: "password",
      },
      async (id, password, done) => {
        try {
          const exUser = await User.findOne({
            where: { id },
            raw: true,
          });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "pwd is not available." });
            }
          } else {
            done(null, false, { message: "please sign up." });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
