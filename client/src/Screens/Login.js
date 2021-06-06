import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { GlobalContext } from "../Context/GlobalState";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { dispatch } = useContext(GlobalContext);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ password, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data.error);
      if (data.error) {
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });
        M.toast({ html: "login successfully", classes: "green darken-3" });
        history.push("/");
        // console.log(data);
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
              <input
                placeholder="Email"
                type="text"
                className="validate"
                value={email}
                required={true}
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
                type="submit"
                className="waves-effect waves-light btn  blue lighten-2"
                onClick={submitHandler}
              >
                Login
              </button>
            </div>
            <h6 className="center">
              Don't Have an account? <Link to="/signup">Sign up </Link>
            </h6>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
