import React from 'react'

const IconArrowLeft = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29px"
    height="18px"
    viewBox="0 0 29 18"
    className={'svg-icon ' + (className ? className : '')}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-1261.000000, -303.000000)">
        <g transform="translate(1261.000000, 302.000000)">
          <path d="M1,10 L28,10" strokeLinecap="round" strokeLinejoin="round" />
          <polyline
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(5.500000, 10.000000) scale(-1, 1) translate(-5.500000, -10.000000) "
            points="1 1 10 10 1 19"
          />
        </g>
      </g>
    </g>
  </svg>
)
export default IconArrowLeft
