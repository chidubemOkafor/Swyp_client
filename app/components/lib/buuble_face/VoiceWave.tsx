import React from 'react';
import Lottie from 'lottie-react';
import voice from "./voice.json"

export default function VoiceWave() {
  return <Lottie className='size-12' animationData={voice} loop autoplay/>;
}
