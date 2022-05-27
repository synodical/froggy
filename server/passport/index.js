const passport = require("passport");
const local = require("./localStrategy");
const Customer = require("../models").Customer;

module.exports = () => {
  passport.serializeUser((customer, done) => {
    done(null, customer.id);
  });

  passport.deserializeUser((id, done) => {
    Customer.findOne({ where: { id } })
      .then((customer) => done(null, customer))
      .catch((customer) => done(customer));
  });

  local();
};
