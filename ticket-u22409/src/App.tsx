import { useState } from "react";
import ImageCapture from "./components/ImageCapture/ImageCapture";
import "./App.css";

function App() {

  return (
    <div className="hello-world-page">
      <div className="title">
        <h2 className="title-text">Hello World for React</h2>
      </div>
      <div className="container"><ImageCapture /></div>
    </div>
  );
}

export default App;
