import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const submitfields = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/signup", {
        method: "POST",
        body: JSON.stringify({ name, password, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      // console.log(data.error);
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        M.toast({ html: data.MSG, classes: "green darken-3" });
        history.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="card my-card">
        <div className="card-content" style={{ width: "100%" }}>
          <form className="form-control">
            <h3 className="main-logo center">Instagram</h3>
            <div className="input-field">
              <div className="input-field">
                <input
                  placeholder="Name"
                  type="text"
                  value={name}
                  className="validate"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <input
                placeholder="Email"
                type="text"
                className="validate"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            <div className="input-field">
              <input
                placeholder="Password"
                type="password"
                className="validate"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="center">
              <button
                className="waves-effect waves-light btn  blue lighten-2"
                onClick={submitfields}
              >
                Signup
              </button>
            </div>
            <h6 className="center">
              Have an account? <Link to="/login">Login</Link>
            </h6>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
