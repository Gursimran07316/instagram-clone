import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";
import M from "materialize-css";

const Navbar = () => {
  const searchModal = useRef(null);
  const mobileNav = useRef(null);
  const history = useHistory();
  const [search, setsearch] = useState("");
  const [users, setusers] = useState("");
  const { state, dispatch } = useContext(GlobalContext);
  useEffect(() => {
    M.Sidenav.init(mobileNav.current);
    M.Modal.init(searchModal.current);
  }, []);
  const Links = () => {
    if (state) {
      return (
        <>
          <li>
            <i
              data-target="modal1"
              style={{ cursor: "pointer" }}
              className="material-icons modal-trigger hide-on-small-only"
            >
              search
            </i>
          </li>
          <li>
            <Link
              to="/profile"
              className="black-text"
              onClick={() => M.Sidenav.getInstance(mobileNav.current).close()}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/createpost"
              className="black-text"
              onClick={() => M.Sidenav.getInstance(mobileNav.current).close()}
            >
              createpost
            </Link>
          </li>
          <li>
            <Link
              to="/followingposts"
              className="black-text"
              onClick={() => M.Sidenav.getInstance(mobileNav.current).close()}
            >
              My feed
            </Link>
          </li>
          <li>
            <button
              className="btn red darken-1 hide-on-small-only"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          </li>
        </>
      );
    } else {
      return (
        <>
          {" "}
          <li>
            <Link to="/login" className="black-text">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="black-text">
              Signup
            </Link>
          </li>{" "}
        </>
      );
    }
  };

  const fetchUsers = async (query) => {
    setsearch(query);
    try {
      const res = await fetch("/getusers", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      console.log(data);
      setusers(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <nav
        style={{ padding: "0rem 10px", marginBottom: "2rem" }}
        className="white "
      >
        <div className="nav-wrapper black-text">
          <Link
            to={state ? "/" : "/signin"}
            className="left main-logo black-text"
          >
            Instagram
          </Link>

          <div style={{ display: "flex" }} className="right hide-on-med-and-up">
            {state && (
              <i
                data-target="modal1"
                style={{ cursor: "pointer" }}
                className="material-icons modal-trigger"
              >
                search
              </i>
            )}
            {state && (
              <i
                className="material-icons sidenav-trigger hamburger"
                data-target="mobile-demo"
              >
                menu
              </i>
            )}
            {state && (
              <button
                className="btn red darken-1"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  history.push("/login");
                }}
              >
                Logout
              </button>
            )}
            {!state && (
              <ul className="right">
                <Links />
              </ul>
            )}
          </div>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <Links />
          </ul>
        </div>
        <div id="modal1" className="modal black-text" ref={searchModal}>
          <div className="modal-content">
            <input
              placeholder="Name"
              type="text"
              value={search}
              className="validate"
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection black-text">
              {!users
                ? ""
                : users.map((user) => {
                    return (
                      <Link
                        to={
                          user._id === state._id
                            ? `profile`
                            : `user/${user._id}`
                        }
                        key={user._id}
                        onClick={() =>
                          M.Modal.getInstance(searchModal.current).close()
                        }
                      >
                        <li className="collection-item avatar">
                          <img
                            src={user.img}
                            alt={user.name}
                            className="circle"
                          />
                          <p className="black-text">{user.name}</p>
                          <p className="black-text">{user.email}</p>
                        </li>{" "}
                      </Link>
                    );
                  })}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat">
              close
            </button>
          </div>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo" ref={mobileNav}>
        <Links />
      </ul>
    </>
  );
};

export default Navbar;
