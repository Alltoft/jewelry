import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../assets/animations/Animation - 1732610247735.json';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <Player
        src={loadingAnimation}
        loop
        autoplay
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  );
};

export default Loading;