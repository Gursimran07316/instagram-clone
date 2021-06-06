import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../Context/GlobalState";
import Loading from "../Components/Loading";

const UserProfile = ({ match }) => {
  const { state, dispatch } = useContext(GlobalContext);
  const [profile, setprofile] = useState(null);
  const [following, setfollowing] = useState(
    state ? state.following.includes(match.params.id) : null
  );
  useEffect(() => {
    const id = match.params.id;
    const fetchData = async () => {
      const res = await fetch(`/user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setprofile(data);
    };

    fetchData();
  }, []);
  useEffect(() => {
    setfollowing(state ? state.following.includes(match.params.id) : null);
  }, [state]);
  const followUser = async (id) => {
    const res = await fetch(`/followuser/${id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await res.json();
    console.log(data);
    dispatch({
      type: "UPDATE",
      payload: {
        following: data.mystate.following,
        followers: data.mystate.followers,
      },
    });
    localStorage.setItem("user", JSON.stringify(data.mystate));
    const newProfile = {
      ...profile.user,
      followers: data.user.followers,
    };
    setfollowing(true);

    setprofile((prev) => {
      return {
        posts: prev.posts,
        user: newProfile,
      };
    });
  };
  const unfollowUser = async (id) => {
    const res = await fetch(`/unfollowuser/${id}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await res.json();
    console.log(data);
    dispatch({
      type: "UPDATE",
      payload: {
        following: data.mystate.following,
        followers: data.mystate.followers,
      },
    });
    localStorage.setItem("user", JSON.stringify(data.mystate));
    const newProfile = {
      ...profile.user,
      followers: data.user.followers,
    };
    setfollowing(false);
    setprofile((prev) => {
      return {
        posts: prev.posts,
        user: newProfile,
      };
    });
  };
  return (
    <>
      {" "}
      {!profile ? (
        <h1>
          <Loading />
        </h1>
      ) : (
        <div className="profile-container">
          <div className="profile-info">
            <div className="pic-div">
              <img
                src={profile.user ? profile.user.img : "loading.."}
                alt="s"
                className="profile-img"
              />
            </div>
            <div className="profile-name">
              <h5>{profile.user ? profile.user.name : "loading.."}</h5>
              <h6>{profile.user ? profile.user.email : "loading.."}</h6>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "108%",
                  flexWrap: "wrap",
                }}
              >
                <h6>{profile.posts.length} posts</h6>
                <h6>{state ? state.followers.length : "0"} followers</h6>
                <h6>{profile.user.following.length} following</h6>
              </div>

              {following ? (
                <button
                  className="btn blue lighten-2 waves-effect waves-light"
                  onClick={() => unfollowUser(profile.user._id)}
                >
                  {" "}
                  unfollow{" "}
                </button>
              ) : (
                <button
                  className="btn blue lighten-2 waves-effect waves-light"
                  onClick={() => followUser(profile.user._id)}
                >
                  follow
                </button>
              )}
            </div>
          </div>
          <hr></hr>
          <div className="gallery">
            {!profile.posts ? (
              <h5 className="blue-text"> Loading..</h5>
            ) : (
              profile.posts.map((post) => {
                return (
                  <img
                    key={post._id}
                    src={post.pic}
                    alt={post.title}
                    className="responsive-img"
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
