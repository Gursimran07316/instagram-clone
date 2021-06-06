const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;
const { isEmail } = require("validator");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new schema({
  name: {
    type: String,
    required: [true, "Please fill the name"],
  },
  email: {
    type: String,
    required: [true, "Please fill the email"],
    unique: [true, "Email is already exists"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please fill the password"],
    minlength: [6, "Password should be atleast 6 chracter"],
  },
  img: {
    type: String,
    default:
      "https://res.cloudinary.com/gur/image/upload/v1603358786/images_aq91kz.png",
  },
  followers: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    const pass = await bcrypt.compare(password, user.password);
    if (pass) return user;
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};
const User = mongoose.model("user", userSchema);
module.exports = User;
