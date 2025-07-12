import { useSocketStore } from '@/app/ws-functions/ws.config';
import React from 'react';
import { useParams } from 'next/navigation';

function Emojies() {
    const { socket, initializeSocket } = useSocketStore();
    const params = useParams()
    const emojiesArray = [
        { 
            emoji: '😂',
        }, 
        { 
            emoji: '🎉',
        }, 
        {   emoji: '😍',
        }, 
        {
            emoji: '😮',
        }, 
        {
            emoji: '🤮',
        }, 
        { 
            emoji: '💀',
        }, 
        {
            emoji: '👍',
        }, 
        {
            emoji: '👎',
        }, 
        {
            emoji: '👏',
        }
    ];

    function handleEmojiPress(emoji_type: string) {
        if (!socket) {
            initializeSocket(params.id as string);
            return;
        }
        socket.emit('emoji', emoji_type)
    }

  return (
    <div className="backdrop-blur-lg bg-neutral-900/70 rounded-xl p-4 flex gap-3 shadow-lg">
      {emojiesArray.map((emoji, index) => (
        <button
          key={index}
          className="text-3xl p-3 bg-neutral-800 rounded-2xl transition transform duration-200 hover:scale-110 active:scale-90 hover:bg-neutral-700 focus:outline-none"
          onClick={() => handleEmojiPress(emoji.emoji)}
        >
          {emoji.emoji}
        </button>
      ))}
    </div>
  );
}

export default Emojies;
