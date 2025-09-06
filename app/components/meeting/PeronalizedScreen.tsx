'use client';

import { useContributorsStore } from '@/app/stores/contributors/useContributorsStore';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import Jazzicon from 'react-jazzicon';
import { BsPin } from "react-icons/bs";
import { useMeetingStore } from '@/app/stores/video/useMeeting';
import { Icon } from '../lib/iconGenerator';
import { useVideoElement } from '../hook/useVideoElement';
import { useSocketStore } from '@/app/ws-functions/ws.config';
import { useParams } from 'next/navigation';
import { useHandStore } from '@/app/stores/tab/useHandStore';
import { IoHandRightOutline } from 'react-icons/io5';
import { useFloatingEmojiStore } from '@/app/stores/emoji/useEmojiStore';
import { trimYou } from '@/app/util/trimYou';
import TalkingIcon from '../lib/buuble_face/BuubleFace';
import VoiceWave from '../lib/buuble_face/VoiceWave';
import { IoMdMicOff } from 'react-icons/io';
import { useMediaSoup } from '../lib/transportLogic';

export default function VideoConferenceLayout() {
  const { peers, setPeers } = useContributorsStore();
  const { socket, initializeSocket } = useSocketStore()
  const { isHand, handRaisedArray, setHandRaisedArray } = useHandStore()
  const { floating } = useFloatingEmojiStore()
  const isInitiator = peers.length > 1 && peers[0].isYou;
  const params = useParams()
  const { remoteVideoRef } = useMediaSoup()
  
  const videoRef = useVideoElement() 
  
  const {
    mediaStream,
    streamType,
    isAudio,
  } = useMeetingStore();

  // const gridCols =
  //   peers.length <= 2 ? 'grid-cols-1' :
  //   peers.length <= 4 ? 'grid-cols-2' :
  //   'grid-cols-3';

  function handlePin(index: number) {
    const pinnedPeer = peers[index];
    const restPeers = peers.filter((_, i) => i !== index);
    setPeers([pinnedPeer, ...restPeers]);
  }

  useEffect(() => {
    if (!socket) {
        initializeSocket(params.id as string);
    }
  }, [socket, initializeSocket, params.id]);

  useEffect(() => {
    if (!socket) return;

    const handleHandDroppedArray = ({ handRaisedArray }:{ handRaisedArray: string[] }) => setHandRaisedArray(handRaisedArray)

    socket.on("raise_hand", handleHandDroppedArray)
    socket.on("hand_down", handleHandDroppedArray)

    return () => {
      socket.off('raise_hand', handleHandDroppedArray),
      socket.off('hand_down', handleHandDroppedArray)
    }

  }, [socket, initializeSocket, isHand ])

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, videoRef]);

  const  handleEmojiDisplay = (username: string) => floating.find((e) => e.username === trimYou(username));

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[77vh] w-full p-4 bg-neutral-900 rounded-md justify-center">
      
      <div className="relative aspect-video bg-neutral-800 rounded-md overflow-hidden shadow-lg">
          {(streamType === 'video' || streamType === 'screenrecording') && mediaStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video h-full object-cover"
            />
          ) : (
            <div className={`h-full flex items-center justify-center text-gray-400  ${isAudio && 'border-4 border-blue-600 animate-pulse border-opacity-20'}`}>
              <Icon />
            </div>
          )}
          {handleEmojiDisplay(peers[0]?.username || "You") && <div className='absolute top-2 left-2 bg-neutral-700 px-2 py-1 rounded'>
            {handleEmojiDisplay(peers[0].username)?.emoji}
          </div>}
          <div className="absolute left-2 bottom-2 text-white text-xs bg-neutral-700 px-2 py-1 rounded">
            {peers[0]?.username || 'You'}
          </div>
          {/* <button className="absolute bottom-2 left-26 bg-red-600 py-2 px-10 rounded-md cursor-pointer" onClick={produce}>produce</button> */}
          <div className='flex items-center space-x-2 absolute right-2 bottom-2'>
          {isAudio ? <VoiceWave/>: <div className=' bg-neutral-700 p-2 rounded-md'>
            <IoMdMicOff className='size-4 rounded-md text-white'/>
          </div>}
          {handRaisedArray.includes(peers[0]?.userId as never) && <div className=' bg-neutral-700 p-2 rounded-md'>
            <IoHandRightOutline className='size-4 rounded-md text-white'/>
          </div>}
          </div>
      </div>
    <div className="flex md:flex-col flex-row flex-wrap gap-3 overflow-auto max-h-full">
  {/* {peers.slice(1).map((peer, i) => ( */}
    <div
      className="relative w-[300px] h-[180px] bg-neutral-800 rounded-md overflow-hidden shadow-md"
    >
      <video
        autoPlay
        playsInline
        muted={false}
        className="w-full h-full object-cover"
        ref={ remoteVideoRef }
      />

      {/* Optional UI overlays */}
      <Jazzicon diameter={48} seed={parseInt(peers[1]?.userId)} />

      {handleEmojiDisplay(peers[1]?.username) && (
        <div className='absolute top-2 left-2 bg-neutral-700 px-2 py-1 rounded z-10'>
          {handleEmojiDisplay(peers[1]?.username)?.emoji}
        </div>
      )}

      <div className="absolute left-2 bottom-2 text-white text-xs bg-neutral-700 px-2 py-1 rounded z-10">
        {peers[1]?.username}
      </div>

      {handRaisedArray.includes(peers[1]?.userId as never) && (
        <div className='absolute right-2 bottom-2 bg-neutral-700 p-2 rounded-md z-10'>
          <IoHandRightOutline className='size-4 text-white' />
        </div>
      )}
    </div>
    {/* <button className='bg-red-600 py-2 rounded-md cursor-pointer'onClick={consume}>consume</button> */}
  {/* ))} */}
  </div>
  </div>
  );
}