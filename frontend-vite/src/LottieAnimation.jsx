import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from './medicine.json';

const LottieAnimation = () => (
  <Player
    autoplay
    loop
    src={animationData}
    style={{ height: '500px', width: '400px' }}
  />
);

export default LottieAnimation; 