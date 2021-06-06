import React from "react";
import spinner from "../img/spinner.gif";
const Loading = () => {
  return (
    <img
      src={spinner}
      alt=""
      style={{ width: "200px", display: "block", margin: "auto" }}
    ></img>
  );
};
export default Loading;
