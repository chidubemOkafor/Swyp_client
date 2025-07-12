import React from 'react'

function AudioRipple({className = ''}: {className: string}) {
  return (
    <div className={className}>
        <div className="absolute w-20 h-20 rounded-full border border-purple-400 animate-radar" />
        <div className="absolute w-20 h-20 rounded-full border border-blue-400 animate-radar delay-300" />
        <div className="absolute w-20 h-20 rounded-full border border-blue-400 animate-radar delay-600" />
    </div>
  )
}

export default AudioRipple
