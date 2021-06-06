import React from "react";
import { Link } from "react-router-dom";

const HomePosts = ({
  post,
  state,
  likePost,
  unlikePost,
  deletePost,
  makeComment,
  deleteComment,
}) => {
  const submitHandler = (e, id) => {
    e.preventDefault();
    const input = e.target[0].value;
    if (input.length) {
      makeComment(input, id);
      e.target[0].value = "";
    }
  };
  return (
    <div className="card post-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 15px",
        }}
      >
        <Link
          to={
            post.postedBy._id === state._id
              ? `profile`
              : `user/${post.postedBy._id}`
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={post.postedBy.img}
              alt="no"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
              className="circle"
            />
            <h4
              style={{
                margin: "0px",
                color: "black",
                textTransform: "capitalize",
              }}
            >
              {" "}
              {post.postedBy.name}{" "}
            </h4>
          </div>
        </Link>
        {post.postedBy._id === state._id && (
          <span
            className="btn-floating pulse red darken-2"
            onClick={() => deletePost(post._id)}
            style={{ cursor: "pointer" }}
          >
            <i className="material-icons">delete</i>
          </span>
        )}
      </div>
      <div className="card-image">
        <img src={post.pic} alt="gg" height="400px" />
      </div>
      <div className="card-content">
        {post.likes.includes(state._id) ? (
          <span
            className="material-icons red-text"
            style={{ cursor: "pointer" }}
            onClick={() => unlikePost(post._id)}
          >
            favorite
          </span>
        ) : (
          <span
            className="material-icons"
            style={{ cursor: "pointer" }}
            onClick={() => likePost(post._id)}
          >
            favorite_border
          </span>
        )}

        <h5>{post.likes.length} likes</h5>
        {/* <p className="flow-text">{post.title}</p> */}
        <p
          className="grey-text flow-text text-darken-3"
          style={{ textTransform: "capitalize" }}
        >
          {post.caption}
        </p>
        {!post.comments ? (
          <p>Loading..</p>
        ) : (
          post.comments.map((comment) => {
            return (
              <p key={comment._id}>
                <span className="flow-text">{comment.postedBy.name} </span>
                {comment.text}
                {comment.postedBy._id === state._id && (
                  <span
                    className="btn-floating pulse right red darken-2"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      deleteComment(comment._id, post._id, comment.text)
                    }
                  >
                    <i className="material-icons">delete</i>
                  </span>
                )}
              </p>
            );
          })
        )}
        <form
          className="input-field comment-box"
          onSubmit={(e) => submitHandler(e, post._id)}
        >
          <input placeholder="Add a comment" type="text" className="validate" />
          <div className="input-field">
            <button
              className="waves-effect waves-light btn  blue lighten-2"
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePosts;
