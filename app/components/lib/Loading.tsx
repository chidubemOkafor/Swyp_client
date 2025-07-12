import React from 'react'

function Loading() {
  return (
    <div className='flex gap-2 justify-center items-center'>
      <div className='size-2 bg-white rounded-full animate-bounce' ></div>
      <div className='size-2 bg-white rounded-full animate-bounce' ></div>
      <div className='size-2 bg-white rounded-full animate-bounce' ></div>
      <div className='size-2 bg-white rounded-full animate-bounce' ></div>
    </div>
  )
}

export default Loading
