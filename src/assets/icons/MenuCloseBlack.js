import React from 'react'

const MenuCloseBlack = ({ className, opacity = '0.5' }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g opacity={opacity}>
      <path
        d="M1.59998 4.5L5.99998 8.25L10.4 4.5"
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

export default MenuCloseBlack
