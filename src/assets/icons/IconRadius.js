import React from 'react'

function IconRadius({ className, width = '16', height = '16' }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1804_9156)">
        <circle cx="8" cy="8" r="7.5" stroke="black" />
        <circle cx="8" cy="8" r="4.5" stroke="black" />
        <circle cx="8" cy="8" r="1.5" stroke="black" />
      </g>
      <defs>
        <clipPath id="clip0_1804_9156">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default IconRadius
