const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new schema(
  {
    pic: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "user",
    },
    likes: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        text: String,
        postedBy: {
          type: ObjectId,
          ref: "user",
        },
      },
    ],
  },
  { timestamps: true }
);
const post = mongoose.model("Post", postSchema);
module.exports = post;
