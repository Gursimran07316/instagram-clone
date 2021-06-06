const User = require("../Model/User");
const Post = require("../Model/Post");
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    console.log(user);
    if (user._id.toString() != req.user._id.toString()) {
      const posts = await Post.find({ postedBy: req.params.id }).populate(
        "postedBy",
        "_id name"
      );
      res.status(200).json({ user, posts });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.updatepic = async (req, res) => {
  try {
    const { img } = req.body;
    const updateduser = await User.findByIdAndUpdate(req.user._id, {
      $set: {
        img,
      },
    });
    res.status(200).json(updateduser);
  } catch (err) {
    console.log(err);
  }
};
module.exports.followUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (id.toString() != req.user._id.toString()) {
      const updatedFollower = await User.findByIdAndUpdate(
        id,
        {
          $push: { followers: req.user._id },
        },
        {
          new: true,
        }
      );
      const updateFollowing = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: id },
        },
        { new: true }
      );
      if (updateFollowing && updatedFollower) {
        res
          .status(200)
          .json({ user: updatedFollower, mystate: updateFollowing });
      } else {
        res.status(401).json({ error: "Something went wrong" });
      }
    } else {
      res.status(401).json({ error: "invaild user" });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.unfollowUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (id.toString() != req.user._id.toString()) {
      const updatedFollower = await User.findByIdAndUpdate(
        id,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      );
      const updateFollowing = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: id },
        },
        {
          new: true,
        }
      );
      if (updateFollowing && updatedFollower) {
        res
          .status(200)
          .json({ user: updatedFollower, mystate: updateFollowing });
      } else {
        res.status(401).json({ error: "Something went wrong" });
      }
    } else {
      res.status(401).json({ error: "invaild user" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const query = new RegExp("^" + req.body.query);
    const user = await User.find({ name: { $regex: query } }).select(
      "name email _id img"
    );
    res.status(200).json({ user });
  } catch {
    console.log(err);
  }
};
