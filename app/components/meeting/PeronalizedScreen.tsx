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
import { useMakeCall } from '../lib/useMakeCall';

export default function VideoConferenceLayout() {
  const { peers, setPeers } = useContributorsStore();
  const { socket, initializeSocket } = useSocketStore()
  const { isHand, handRaisedArray, setHandRaisedArray } = useHandStore()
  const { floating } = useFloatingEmojiStore()
  const { remoteStreamRef } = useMakeCall()
  const params = useParams()
  
  const videoRef = useVideoElement() 
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const {
    mediaStream,
    streamType,
    isAudio,
  } = useMeetingStore();

  const gridCols =
    peers.length <= 2 ? 'grid-cols-1' :
    peers.length <= 4 ? 'grid-cols-2' :
    'grid-cols-3';

  function handlePin(index: number) {
    const pinnedPeer = peers[index];
    const restPeers = peers.filter((_, i) => i !== index);
    setPeers([pinnedPeer, ...restPeers]);
  }

  useEffect(() => {
    if (!socket) {
      initializeSocket(params.id as string);
      return;
    }

    const handleHandDroppedArray = ({ handRaisedArray }:{ handRaisedArray: string[] }) => setHandRaisedArray(handRaisedArray)

    socket.on("raise_hand", handleHandDroppedArray)
    socket.on("hand_down", handleHandDroppedArray)

    return () => {
      socket.off('raise_hand', handleHandDroppedArray),
      socket.off('hand_down', handleHandDroppedArray)
    }

  }, [socket, initializeSocket, isHand ])

   useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [remoteStreamRef, remoteVideoRef]);

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
            <div className="h-full flex items-center justify-center text-gray-400">
              {isAudio ? (
                <div className="flex flex-col items-center">
                  <Icon />
                  <p className="text-sm mt-2">🎤 Audio Only</p>
                </div>
              ) : (
                <Icon />
              )}
            </div>
          )}
          {handleEmojiDisplay(peers[0]?.username || "You") && <div className='absolute top-2 left-2 bg-neutral-700 px-2 py-1 rounded'>
            {handleEmojiDisplay(peers[0].username)?.emoji}
          </div>}
          <div className="absolute left-2 bottom-2 text-white text-xs bg-neutral-700 px-2 py-1 rounded">
            {peers[0]?.username || 'You'}
          </div>
          {handRaisedArray.includes(peers[0]?.userId as never) && <div className='absolute right-2 bottom-2 bg-neutral-700 p-2 rounded-md'>
            <IoHandRightOutline className='size-4 rounded-md text-white'/>
          </div>}
        </div>
        <div className="flex md:flex-col flex-row flex-wrap gap-3 overflow-auto md:max-w-[300px] max-h-[100%]">
          {peers.slice(1).map((peer, i) => (
      <div
        key={peer.userId}
        className="relative bg-neutral-800 aspect-video w-[300px] rounded-md flex items-center justify-center shadow-sm"
      >
        <video
          autoPlay
          playsInline
          muted={false}
          ref={(el) => {
            videoRef.current[peer.userId] = el;
            if (el && remoteStreamRef.current) {
              el.srcObject = remoteStreamRef.current; // for now, only one stream
            }
          }}
          className="absolute w-full h-full object-cover"
        />

        <Jazzicon diameter={64} seed={parseInt(peer.userId)} />

        {handleEmojiDisplay(peer.username) && (
          <div className='absolute top-2 left-2 bg-neutral-700 px-2 py-1 rounded'>
            {handleEmojiDisplay(peer.username)?.emoji}
          </div>
        )}
        <div className="absolute left-2 bottom-2 text-white text-xs bg-neutral-700 px-2 py-1 rounded">
          {peer.username}
        </div>
        {handRaisedArray.includes(peer.userId as never) && (
          <div className='absolute right-2 bottom-2 bg-neutral-700 p-2 rounded-md'>
            <IoHandRightOutline className='size-4 rounded-md text-white'/>
          </div>
        )}
      </div>
    ))}
    </div>
  </div>
  );
}