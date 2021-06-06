const User = require("../Model/User");
const Post = require("../Model/Post");
const post = require("../Model/Post");
module.exports.createPost = async (req, res) => {
  const user = req.user;
  const { caption, pic } = req.body;
  if (!pic || !caption) {
    return res.status(401).json({ error: "Please fill all the filds" });
  }
  try {
    const post = await Post.create({ caption, pic, postedBy: user._id });
    res.status(201).json({ post });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getPosts = async (req, res) => {
  // console.log(req.user);
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name img")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(201).json({ posts });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getFollowingsPosts = async (req, res) => {
  // console.log(req.user);
  try {
    const posts = await Post.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name img")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(201).json({ posts });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getMyPosts = async (req, res) => {
  const user = req.user;
  // console.log(user);
  try {
    const posts = await Post.find({ postedBy: user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(201).json({ posts });
  } catch (err) {
    console.log(err);
  }
};
module.exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name img")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(401).json({ error: err });
      } else {
        res.json(result);
      }
    });
};
module.exports.unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name img")
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
      if (error) {
        res.status(401).json({ error });
      } else {
        res.json(result);
      }
    });
};
module.exports.deletePost = async (req, res) => {
  // console.log(req);
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "id")
    .exec((err, post) => {
      if (err || !post) {
        console.log("yes", err);

        res.status(401).json({ error: err });
      } else {
        // console.log(post);
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          console.log("yes");
          post
            .remove()
            .then((result) => {
              res.json(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
};
module.exports.addComment = (req, res) => {
  const comments = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name img")
    .exec((err, result) => {
      if (err) {
        res.status(401).json({ error });
      } else {
        res.json(result);
      }
    });
};
module.exports.deleteComment = async (req, res) => {
  const { postId, id, text } = req.body;
  // console.log(postId, id, req.body);
  // console.log(req.body);
  const comment = {
    postedBy: req.user._id,
    _id: id,
    text,
  };
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name img");

    res.status(200).json({ post });
  } catch (err) {
    console.log(err);
  }
};
