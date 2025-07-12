import React from 'react'

function OtherScreens({ className, ...props }: { className: string, props: any }) {
  return (
    <div className={`bg-neutral-900 flex flex-wrap rounded-4xl ${className}`} {...props}>
    </div>
  )
}

export default OtherScreens
