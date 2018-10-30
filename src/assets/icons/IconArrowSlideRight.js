import React from 'react'

const IconArrowSlideRight = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="22"
    viewBox="0 0 12 22"
    className={'svg-icon ' + (className ? className : '')}>
    <polyline
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      points="1 1 11 11 1 21"
    />
  </svg>
)
export default IconArrowSlideRight
