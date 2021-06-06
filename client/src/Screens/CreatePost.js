import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import Loading from "../Components/Loading";
const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImg] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setloading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (url) {
      const fetchdata = async () => {
        try {
          const res = await fetch("/createpost", {
            method: "POST",
            body: JSON.stringify({ caption, pic: url }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          });

          const data = await res.json();
          setloading(false);
          // console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({ html: "posted successfully", classes: "green darken-3" });

            // console.log(data.post);
            history.push("/");
          }
        } catch (err) {
          setloading(false);
          console.log(err);
        }
      };
      fetchdata();
    }
  }, [url]);

  const setPostDetails = async (e) => {
    e.preventDefault();
    setloading(true);
    const data = new FormData();
    data.append("file", image);
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
    setUrl(result.url);
  };
  return (
    <>
      {loading ? (
        <h1>
          <Loading />
        </h1>
      ) : (
        <div
          style={{ display: "flex", width: "100% ", justifyContent: "center" }}
        >
          <div className="card my-card">
            <div className="card-content" style={{ width: "100%" }}>
              <form className="form-control">
                <h3 className="main-logo center">Instagram</h3>

                <div className="file-field input-field">
                  <div className="btn blue lighten-2">
                    <span>Choose pic </span>
                    <input
                      type="file"
                      onChange={(e) => setImg(e.target.files[0])}
                    />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                  </div>
                </div>
                <div className="input-field">
                  <input
                    placeholder="add a caption.."
                    type="text"
                    className="validate"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                <div className="center">
                  <button
                    className="waves-effect waves-light btn  blue lighten-2"
                    onClick={setPostDetails}
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
