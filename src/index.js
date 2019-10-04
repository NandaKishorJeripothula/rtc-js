import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home.component";
import "./styles.css";
import RecordStream from "./RecordStream";

function App() {
  return (
    <div className="App">
      {/* <h1>Hello CodeSandbox</h1> */}
      {/* <h2>Start editing to see some magic happen!</h2> */}
      {/* <Home /> */}
      <RecordStream />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
