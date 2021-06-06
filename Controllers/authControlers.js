const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const { JWT_Secret } = require("../config/keys");

// handle errors

const handleErrors = (err) => {
  //   console.log(err);
  console.log(err.code);
  if (
    err.message === "Incorrect password" ||
    err.message === "Incorrect email"
  ) {
    return err.message;
  }
  if (err.code === 11000) {
    return "Email already existed";
  }

  if (err.message.includes("user validation failed")) {
    // console.log(err) properties
    return "Please enter a valid email";
  }
  return "Some thing went wrong plese try again";
};
const maxAge = 3 * 24 * 60 * 60;
const getToken = (id) => {
  return jwt.sign({ id }, JWT_Secret, {
    expiresIn: maxAge,
  });
};

module.exports.home = (req, res) => {
  res.send("ghlo");
};
module.exports.signup = async (req, res) => {
  const { name, email, password, img } = req.body;

  if (!email || !password || !name) {
    res.status(401).json({ error: " Please fill all the fields" });
  }
  if (password.length < 6) {
    res.status(401).json({ error: " Password should be  6 digits long" });
  }
  try {
    const user = await User.create({
      email,
      password,
      name: name.charAt(0).toUpperCase() + name.slice(1),
    });

    res.status(200).json({ MSG: "Account created sucessfully!" });
  } catch (err) {
    // console.log(err);
    const errormsg = handleErrors(err);
    res.status(401).json({ error: errormsg });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({ error: " Please fill all the fields" });
  }

  try {
    const user = await User.login(email, password);
    const token = getToken(user.id);
    res.cookie("JWT", token, {
      maxAge: maxAge * 1000,
    });
    console.log(user);
    res.status(200).json({
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        following: user.following,
        followers: user.followers,
        img: user.img,
      },
    });
  } catch (err) {
    console.log(err.message);
    const errormsg = handleErrors(err);
    res.status(401).json({ error: errormsg });
  }
};
// module.exports.signupGet=(req,res)=>{

// }
