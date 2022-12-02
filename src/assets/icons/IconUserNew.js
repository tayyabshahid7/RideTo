import React from 'react'

const IconUserNew = ({ className }) => (
  <svg
    width="30"
    height="31"
    viewBox="0 0 30 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={'svg-icon ' + (className ? className : '')}>
    <g filter="url(#filter0_dd_1282_5021)">
      <circle cx="15" cy="12" r="8" fill="#2CCEAC" />
      <circle cx="15" cy="12" r="9.5" stroke="white" strokeWidth="3" />
    </g>
    <defs>
      <filter
        id="filter0_dd_1282_5021"
        x="0"
        y="0"
        width="30"
        height="31"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_1282_5021"
        />
        <feOffset />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0784314 0 0 0 0 0.0784314 0 0 0 0 0.0784314 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1282_5021"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1282_5021"
          result="effect2_dropShadow_1282_5021"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1282_5021"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
)
export default IconUserNew
