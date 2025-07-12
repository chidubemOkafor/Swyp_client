"use client"

import React, { useEffect, useState } from 'react'
import { RiSendPlane2Line } from "react-icons/ri";
import { useSocketStore } from '@/app/ws-functions/ws.config';
import { useParams } from 'next/navigation'
import { MessageType, useChatStore } from '@/app/stores/chat/useChatStore';



function Chat({setTitle}:{setTitle: React.Dispatch<React.SetStateAction<string>>}) {
  
  const {chat, setChat} = useChatStore()
  const [message, setMessage] = useState("")
  const params = useParams();
  const { socket, initializeSocket } = useSocketStore();

  useEffect(() => {
    setTitle("chat")
    if (!socket) {
      initializeSocket(params.id as string);
      return;
    }

    socket.emit('join-room');
    socket.on('my-message', (data: MessageType) => {
      data = {
        ...data,
        user: {
          ...data.user,
          username:  data.user?.username + "(You)"
        }
      }
      setChat((prev) => [...prev, data]); 
    });

    socket.on('chat-message', (data: MessageType) => {
      setChat((prev) => [...prev, data]); 
    });
  }, [socket,initializeSocket,params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!socket) {
      initializeSocket(params.id as string);
      return;
    }
  
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("chat-message", { message });
    setMessage("");
  };

  return (
    <div className='flex flex-col h-[67vh] mt-5'> 
      <div className='flex-1 flex flex-col space-y-3 overflow-hidden'>
        <div className='p-4 bg-neutral-800 rounded-md'>
          <p className='text-[13px] text-neutral-400'>
            All messages sent here are e2e encrypted and cannot be accessed by anyone outside of the meeting
          </p>
        </div>

        <div 
          id='text-area' 
          className='
          flex-1  overflow-x-hidden bg-neutral-900 rounded-md p-4 space-y-3 
          scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800
        '
        >
          {!chat || chat.length === 0 ?
            <div className='flex justify-center items-center h-full'>
              <p className='text-[13px] text-neutral-400'>
                No message
              </p>
            </div>
           :
          chat.map((chat, i) => (
            <div key={i}>
              <p className='font-bold text-[14px]'>{chat.user?.username} <span className='text-[12px]'>{chat.createdAt}</span></p>
              <p className='text-neutral-400 text-[14px]'>
                {chat.message}
              </p>
            </div>
          ))}
        </div>
      </div>
      <form className='bg-neutral-800 w-full rounded-md flex mt-3' onSubmit={handleSubmit}>
        <input 
          type='text' 
          className='bg-neutral-700 outline-none border border-gray-800 pl-4 py-3 rounded-l-md w-full'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button className='px-4 cursor-pointer' type='submit'>
          <RiSendPlane2Line className='size-6'/>
        </button>
      </form>
    </div>
  )
}

export default Chat;
