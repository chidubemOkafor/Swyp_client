"use client"

import React, { useEffect } from 'react'
import PeronalizedScreen from './PeronalizedScreen'
import Tabs from './lowerbar/Tabs'
import { sidebarStore } from '@/app/stores/sidebar-button/sideBarStore'
import { motion } from 'framer-motion'
import { useSocketStore } from '@/app/ws-functions/ws.config';
import { useParams } from 'next/navigation'
import { MessageType, useChatStore } from '@/app/stores/chat/useChatStore'
import { TPeers, useContributorsStore } from '@/app/stores/contributors/useContributorsStore'
import SideBar from './sidebar/SideBar'
import { useFloatingEmojiStore } from '@/app/stores/emoji/useEmojiStore'
import FloatingEmoji from '../lib/FloatingEmoji'
import { useMakeCall } from '../lib/useMakeCall'
import { useMeetingStore } from '@/app/stores/video/useMeeting'

const Meeting = () => {
  const tab = sidebarStore(state => state.tab)
  const { socket, initializeSocket } = useSocketStore()
  const { setPeers, getAmount, amount } = useContributorsStore()
  const { triggerEmoji } = useFloatingEmojiStore()
  const setChat = useChatStore(state => state.setChat)
  const params = useParams()
  const { makeCall } = useMakeCall()
  const { mediaStream } = useMeetingStore();
  
  useEffect(() => {
    if (!socket) {
      initializeSocket(params.id as string);
      return;
    }

    async function handleMakeCall() {
      if (!socket) return
      if(mediaStream) {
          await makeCall(socket)
      }
    }

    handleMakeCall()

    socket.emit('join-meeting');
    socket.emit('get-stream-type')
  
    const handleJoinMeeting = ({ success }: { success: boolean}) => {
      if (success) {
        socket.emit('get-all-messages');
        socket.emit('get-peers');
      }
    };
  
    const handleGetAllMessages = ({ messages }: { messages: MessageType[] }) => {
      setChat(messages);
    };
  
    const handleGetPeers = ({ peers }: { peers: TPeers[] }) => {
      setPeers(peers);
      getAmount(peers.length);
    };
  
    const handlePeerJoined = (incomingPeer: Omit<TPeers, "videoRef">) => {
      const newPeer: TPeers = {
        ...incomingPeer,
        videoRef: React.createRef<HTMLVideoElement>(),
      }
    
      if (newPeer && newPeer.username) {
        setPeers(prev => {
          const exists = prev.some(peer => peer.username === newPeer.username);
          if (exists) return prev;
    
          const updates = [...prev, newPeer];
          getAmount(updates.length);
          return updates;
        });
      }
    }
    
    const handlePeerLeft = ({ userId }: { userId: string }) => {
      setPeers(prev => {
        const updated = prev.filter(peer => peer && peer.userId !== userId);
        getAmount(updated.length);
        return updated;
      });
    };

    const handleEmojiToggle = ({ emoji, username }: { emoji: string, username: string }) => triggerEmoji(emoji, username)
    
    socket.on('emoji', handleEmojiToggle)
    socket.on('join-meeting', handleJoinMeeting);
    socket.on('get-all-messages', handleGetAllMessages);
    socket.on('get-peers', handleGetPeers);
    socket.on('peer-joined', handlePeerJoined);
    socket.on('peer-left', handlePeerLeft);

    return () => {
      socket.on('emoji', handleEmojiToggle)
      socket.off('join-meeting', handleJoinMeeting);
      socket.off('get-all-messages', handleGetAllMessages);
      socket.off('get-peers', handleGetPeers);
      socket.off('peer-joined', handlePeerJoined);
      socket.off('peer-left', handlePeerLeft);
    };
  
  }, [socket, initializeSocket, params.id, setChat, setPeers, getAmount, mediaStream]);

  return (
    <div className='px-10 flex flex-col gap-5 overflow-hidden'>
      <div className='flex gap-5'>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`transition-all duration-500 ${
            tab ? "w-[80%]" : "w-full"
          }`}
        >
        <PeronalizedScreen />
        </motion.div>
        <FloatingEmoji/>
        <SideBar/>
      </div>
      <Tabs/>
    </div>
  )
}

export default Meeting
