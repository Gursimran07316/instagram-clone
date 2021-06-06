const Router = require("express").Router();
const { home, signup, login } = require("../Controllers/authControlers");
Router.get("/", home);
Router.post("/signup", signup);
Router.post("/login", login);
module.exports = Router;
