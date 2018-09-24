import React from 'react'

const IconInfo = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15px"
    height="15px"
    viewBox="0 0 15 15"
    className={'svg-icon ' + (className ? className : '')}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-391.000000, -1361.000000)">
        <g transform="translate(280.000000, 1208.000000)">
          <g>
            <g transform="translate(40.000000, 149.000000)">
              <g transform="translate(71.000000, 4.000000)">
                <circle
                  fillRule="nonzero"
                  opacity="0.5"
                  cx="7.5"
                  cy="4"
                  r="1"
                />
                <circle
                  opacity="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  cx="7.5"
                  cy="7.5"
                  r="7"
                />
                <path
                  d="M7.5,11.5 L7.5,7.5"
                  opacity="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
export default IconInfo
