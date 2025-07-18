import React from 'react';
import Lottie from 'lottie-react';
import animationData from './animation.json'

export default function TalkingIcon() {
  return <Lottie animationData={animationData} loop autoplay/>;
}
