import React, { useEffect, useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";
import Navbar from "./Components/Navbar";
import FollowingPosts from "./Screens/FollowingPosts";
import { GlobalProvider, GlobalContext } from "./Context/GlobalState";
import CreatePost from "./Screens/CreatePost";
import Profile from "./Screens/Profile";
import UserProfile from "./Screens/UserProfile";
function App() {
  const Routing = () => {
    const { dispatch } = useContext(GlobalContext);
    const history = useHistory();
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        dispatch({ type: "USER", payload: user });
      } else {
        history.push("/login");
      }
    }, []);
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/createpost" component={CreatePost} />
        <Route path="/profile" component={Profile} />
        <Route path="/followingposts" component={FollowingPosts} />
        <Route path="/user/:id" component={UserProfile} />
      </Switch>
    );
  };
  return (
    <div>
      <Router>
        <GlobalProvider>
          <Navbar />

          <Routing />
        </GlobalProvider>
      </Router>
    </div>
  );
}

export default App;
