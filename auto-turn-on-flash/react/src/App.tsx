import { useState, useCallback } from 'react';
import './App.css';
import reactLogo from './assets/logo.svg';
import VideoCapture from './components/VideoCapture/VideoCapture';

function App() {
  const [bScan, setBScan] = useState(false);
  const switchScan = useCallback(()=>{
    setBScan(!bScan);
  },[bScan]);
  return (
    <div className='App'>
      <div className='title'>
        <h2 className='title-text'>Auto Turn on Flash</h2>
        <img className='title-logo' src={reactLogo} alt="logo"></img>
      </div>
      <button onClick={switchScan}>{bScan?'stop':'start'} scan</button>
      {bScan && <VideoCapture />}
    </div>
  );
}

export default App;
