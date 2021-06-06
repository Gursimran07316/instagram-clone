import React, { useEffect, useState, useContext } from "react";

import M from "materialize-css";
import Posts from "../Components/HomePosts";
import { GlobalContext } from "../Context/GlobalState";
import { Link } from "react-router-dom";
const Home = () => {
  const [posts, setposts] = useState([]);
  const { state } = useContext(GlobalContext);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("/followingposts", {
          method: "get",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });

        const data = await res.json();
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          // console.log(data.posts);
          setposts(data.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchdata();
  }, []);
  //  Refresh state
  const refreshState = (data) => {
    const newData = posts.map((item) => {
      if (item._id === data._id) {
        return data;
      } else {
        return item;
      }
    });
    setposts(newData);
  };

  // Like post
  const likePost = async (id) => {
    // console.log(id);
    const res = await fetch("/like", {
      method: "PUT",
      body: JSON.stringify({ postId: id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await res.json();
    // console.log(data);
    refreshState(data);
  };
  // Unlike Post
  const unlikePost = async (id) => {
    // console.log(id);
    const res = await fetch("/unlike", {
      method: "PUT",
      body: JSON.stringify({ postId: id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await res.json();
    // console.log(data);
    refreshState(data);
  };
  // Delete Posts
  const deletePost = async (id) => {
    // console.log(id);
    try {
      const res = await fetch(`/deletepost/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const data = await res.json();
      // console.log(data);
      const newData = posts.filter((post) => post._id != data._id);
      setposts(newData);
    } catch (err) {
      console.log(err);
    }
  };
  // Make Comment
  const makeComment = async (text, id) => {
    const res = await fetch("/comment", {
      method: "PUT",
      body: JSON.stringify({ postId: id, text }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await res.json();
    // console.log(data);
    refreshState(data);
  };
  const deleteComment = async (cid, id, text) => {
    console.log(id, cid, text);
    const res = await fetch(`/deletecomment`, {
      method: "PUT",
      body: JSON.stringify({ postId: id, text, id: cid }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const { post } = await res.json();
    // console.log(data.post._id);
    refreshState(post);
  };
  return !posts[0] ? (
    <div className="card post-card">
      <div class="card-content">
        <span class="card-title flow-text">
          Please follow some one to view there posts
        </span>
        <Link to="/">Go back to home page</Link>
      </div>
    </div>
  ) : (
    posts.map((post) => {
      return (
        <Posts
          key={post._id}
          post={post}
          likePost={likePost}
          unlikePost={unlikePost}
          deletePost={deletePost}
          makeComment={makeComment}
          state={state}
          deleteComment={deleteComment}
        />
      );
    })
  );
};
export default Home;
