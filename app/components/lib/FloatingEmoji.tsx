import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { useFloatingEmojiStore } from '@/app/stores/emoji/useEmojiStore'

function FloatingEmoji() {
    const {floating} = useFloatingEmojiStore()
    return (
        <AnimatePresence>
            {floating.map(({id, emoji, username }) => (
            <motion.div
                key={id}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -900, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 5 }}
                className={`absolute right-20 bottom-5 text-5xl pointer-events-none flex items-center flex-col`}
            >
                {emoji}
                <p className='rounded-md bg-neutral-700 text-neutral-100 text-[13px] px-2 py-1 text-center mt-3'>{username}</p>
            </motion.div>
            ))}
        </AnimatePresence>
    )
}

export default FloatingEmoji
