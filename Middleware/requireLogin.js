const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { JWT_Secret } = require("../config/keys");
module.exports.loginRequire = (req, res, next) => {
  //   console.log(req.headers);
  const { authorization } = req.headers;
  //   console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ error: "Youu must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_Secret, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Youu must be logged in" });
    }
    try {
      const user = await User.findById(payload.id);
      req.user = user;
      req.user.password = undefined;
      next();
    } catch (err) {
      return res.status(401).json({ err });
    }
  });
};
