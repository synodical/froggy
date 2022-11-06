const passport = require("passport");
const local = require("./localStrategy");
const User = require("../models").User;

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  /*
  serializeUser 메서드에서는 function(user, done)을 이용해서 session에 저장할 정보를 done(null, user)과 같이 두번째 인자로 넘기면 된다.
  이때 user로 넘어오는 정보는 앞의 LocalStrategy 객체의 인증함수에서 done(null, user)에 의해 리턴된 값이 넘어온다. 
  
  deserializeUser의 callback함수의 첫번째 인자로 넘어오는 내용은 사용자 정보이다. 
  이렇게 리턴된 내용은 HTTP Request 에 “req.user” 값으로 다른 페이지에 전달된다.

  Session에 저장하는 사용자 정보가 크다면, 메모리가 많이 소모되기 때문에 키 정보만 저장함
  페이지가 접근될때 마다 deserilizeUser가 수행되면,
  세션에 저장된 사용자 id를 이용하여 데이타베이스에서 정보를 추가로 select해서 HTTP request에 붙여서 사용
  */
  passport.deserializeUser((id, done) => {
    console.log("deserial");
    console.log("id:", id);
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};
