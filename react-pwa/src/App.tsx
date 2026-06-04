import { useState, Suspense, lazy } from "react";
import reactLogo from "./assets/logo.svg";
import "./App.css";

const VideoCapture = lazy(()=>import("./components/VideoCapture/VideoCapture"));
const ImageCapture = lazy(()=>import("./components/ImageCapture/ImageCapture"));

enum Modes {
  NONE = "none",
  VIDEO_CAPTURE = "video",
  IMAGE_CAPTURE = "image",
}

function App() {
  const [mode, setMode] = useState(Modes.NONE);

  const showVideoCapture = () => setMode(Modes.VIDEO_CAPTURE);

  const showImageCapture = () => setMode(Modes.IMAGE_CAPTURE);

  return (
    <div className="hello-world-page">
      <div className="title">
        <h2 className="title-text">Hello World for React</h2>
        <img className="title-logo" src={reactLogo} alt="logo"></img>
      </div>
      <div className="buttons-container">
        <button
          style={{
            backgroundColor: mode === Modes.VIDEO_CAPTURE ? "rgb(255,174,55)" : "white",
          }}
          onClick={showVideoCapture}
        >
          Decode Video
        </button>
        <button
          style={{
            backgroundColor: mode === Modes.IMAGE_CAPTURE ? "rgb(255,174,55)" : "white",
          }}
          onClick={showImageCapture}
        >
          Decode Image
        </button>
      </div>
      <div className="container">
        {mode === Modes.VIDEO_CAPTURE && <Suspense fallback={'Loading...'}><VideoCapture /></Suspense>}
        {mode === Modes.IMAGE_CAPTURE && <Suspense fallback={'Loading...'}><ImageCapture /></Suspense>}
      </div>
    </div>
  );
}

export default App;
