import React, { useEffect, useContext } from "react";
import { GlobalContext } from "../Context/GlobalState";
import { useState } from "react";
import Loading from "../Components/Loading";

import M from "materialize-css";
import { Link } from "react-router-dom";
const Profile = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [loading, setloading] = useState(true);
  const [posts, setposts] = useState("");
  const [img, setImg] = useState("");
  useEffect(() => {
    // console.log(state);
    const fetchdata = async () => {
      try {
        const res = await fetch("/myposts", {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const data = await res.json();
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          // console.log(data.posts);
          // console.log(state);
          setposts(data.posts);
          setloading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);
  useEffect(() => {
    if (img) {
      const updates = async () => {
        setloading(true);
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "Insta-clone");
        data.append("cloud_name", "gur");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/gur/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const result = await res.json();
        // console.log(result);
        const resp = await fetch("/updatepic", {
          method: "PUT",
          body: JSON.stringify({ img: result.url }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const newdata = await resp.json();
        M.toast({ html: "Updated succeccfully", classes: "green darken-3" });

        // console.log(newdata, newdata.img);
        dispatch({ type: "UPDATEPIC", payload: newdata.img });
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, img: newdata.img })
        );
        setloading(false);
        // window.reload();
      };
      updates();
    }
  }, [img]);
  return (
    <>
      {" "}
      {loading ? (
        <h1>
          <Loading />
        </h1>
      ) : (
        <div className="profile-container">
          <div className="profile-info">
            <div className="pic-div">
              <img
                src={state ? state.img : "loading.."}
                alt="s"
                className="profile-img"
              />
            </div>
            <div className="profile-name">
              <h5>{state ? state.name : "loading.."}</h5>
              <h6>{state ? state.email : "loading.."}</h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "108%",
                  flexWrap: "wrap",
                }}
              >
                <h6>{posts.length} posts</h6>
                <h6>{state ? state.followers.length : "0"} followers</h6>
                <h6>{state ? state.following.length : "0"} following</h6>
              </div>
            </div>
          </div>
          <div className="file-field input-field">
            <div className="btn blue lighten-2">
              <span>Choose pic </span>
              <input type="file" onChange={(e) => setImg(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <hr></hr>
          <div className="gallery">
            {!posts ? (
              <h1>
                {" "}
                <Loading />
              </h1>
            ) : posts.length ? (
              posts.map((post) => {
                return (
                  <img
                    key={post._id}
                    src={post.pic}
                    alt={post.title}
                    className="responsive-img"
                  />
                );
              })
            ) : (
              <Link to="/createpost" className="btn blue lighten-2">
                Post a pic
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
