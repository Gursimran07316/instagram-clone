const Router = require("express").Router();
const { loginRequire } = require("../Middleware/requireLogin");
const {
  getUser,
  followUser,
  unfollowUser,
  updatepic,
  getUsers,
} = require("../Controllers/userControler");
Router.get("/user/:id", loginRequire, getUser);
Router.post("/getusers", loginRequire, getUsers);
Router.put("/updatepic", loginRequire, updatepic);
Router.put("/followuser/:id", loginRequire, followUser);
Router.put("/unfollowuser/:id", loginRequire, unfollowUser);
module.exports = Router;
