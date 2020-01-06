import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

/* mobile friendly */
function setRealViewHeight(): void {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
window.addEventListener("resize", () => {
  setRealViewHeight();
});
setRealViewHeight();

ReactDOM.render(<App />, document.getElementById("root"));
