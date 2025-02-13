import React from "react";
import reactLogo from "./assets/starbucksRound.png";
import "./dynamsoft.config"; // import side effects. The license, engineResourcePath, so on.
import VideoCapture from "./components/VideoCapture/VideoCapture";
import "./App.css";

class App extends React.Component {
  state = {
    result: ""
  };

  setResult = (newResult: string) => {
    this.setState({
      result: newResult
    })
  }
  
  render() {
    return (
      <div className="hello-world-page">
        <div className="title">
          <img className="title-logo" src={reactLogo} alt="logo"></img>
          <div className="result">
            <div className="title">
            Result
            </div>
            <div className="values">
            {this.state.result}
            </div>
            </div>
        </div>
        <div className="container">{<VideoCapture setResult={this.setResult} />}</div>
      </div>
    );
  }
}

export default App;
