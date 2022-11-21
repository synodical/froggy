const AppIp = new Map();

//AppIp.set("FLASK", "");
// AppIp.set("FLASK", "http://localhost:8000");
// AppIp.set("FLASK", "http://172.31.13.120:8000");
AppIp.set(
  "FLASK",
  "http://ec2-13-52-77-67.us-west-1.compute.amazonaws.com:8000"
);
module.exports = AppIp;
