import React from 'react'

const IconCalendar = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15px"
    height="16px"
    viewBox="0 0 15 16"
    className={'svg-icon ' + (className ? className : '')}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-305.000000, -280.000000)">
        <g transform="translate(32.000000, 264.000000)">
          <g transform="translate(273.000000, 16.000000)">
            <g stroke="#111111" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5,8.5 L7.5,12.5" />
              <path d="M5.5,10.5 L9.5,10.5" />
              <path d="M13.5,2.5 L1.5,2.5 C0.948,2.5 0.5,2.948 0.5,3.5 L0.5,14.5 C0.5,15.052 0.948,15.5 1.5,15.5 L13.5,15.5 C14.052,15.5 14.5,15.052 14.5,14.5 L14.5,3.5 C14.5,2.948 14.052,2.5 13.5,2.5 Z" />
              <path d="M0.5,5.5 L14.5,5.5" />
              <path d="M4.5,0.5 L4.5,2.5" />
              <path d="M10.5,0.5 L10.5,2.5" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
)
export default IconCalendar
