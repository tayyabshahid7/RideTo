import React from 'react'

function UserAvatar(props) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <g mode="light">
        <circle cx="64" cy="64" r="64" fill="rgb(193, 199, 208)"></circle>
        <g>
          <path
            d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
            fill="white"
          />
          <path
            d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
            fill="white"
          />
        </g>
      </g>
    </svg>
  )
}

export default UserAvatar
