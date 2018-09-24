import React from 'react'

const IconArrowRight = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29px"
    height="18px"
    viewBox="0 0 29 18"
    className={'svg-icon ' + (className ? className : '')}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-713.000000, -1317.000000)">
        <g transform="translate(280.000000, 1208.000000)">
          <g>
            <g transform="translate(392.000000, 0.000000)">
              <g transform="translate(41.000000, 73.000000)">
                <g transform="translate(0.000000, 35.000000)">
                  {/* <rect id="Background" x="0" y="0" width="29" height="20"></rect> */}
                  <path
                    d="M1,10 L28,10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="19 1 28 10 19 19"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
export default IconArrowRight
