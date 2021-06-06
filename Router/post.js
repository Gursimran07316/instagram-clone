const Router = require("express").Router();
const { loginRequire } = require("../Middleware/requireLogin");

const {
  createPost,
  getPosts,
  getFollowingsPosts,
  getMyPosts,
  likePost,
  unlikePost,
  deletePost,
  addComment,
  deleteComment,
} = require("../Controllers/postController");
Router.post("/createpost", loginRequire, createPost);
Router.get("/posts", loginRequire, getPosts);
Router.get("/followingposts", loginRequire, getFollowingsPosts);
Router.get("/myposts", loginRequire, getMyPosts);
Router.put("/like", loginRequire, likePost);
Router.put("/unlike", loginRequire, unlikePost);
Router.delete("/deletepost/:postId", loginRequire, deletePost);
Router.put("/deletecomment", loginRequire, deleteComment);
Router.put("/comment", loginRequire, addComment);
module.exports = Router;
