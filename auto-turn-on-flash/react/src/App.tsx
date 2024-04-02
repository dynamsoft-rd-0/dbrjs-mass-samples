import { useState } from 'react';
import './App.css';
import reactLogo from './assets/logo.svg';
import VideoCapture from './components/VideoCapture/VideoCapture';

function App() {
  const [mode, setMode] = useState("video");
  return (
    <div className='App'>
      <div className='title'>
        <h2 className='title-text'>Auto Turn on Flash</h2>
        <img className='title-logo' src={reactLogo} alt="logo"></img>
      </div>
      <VideoCapture />
    </div>
  );
}

export default App;
