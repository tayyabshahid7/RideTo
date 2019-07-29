import React from 'react'

const style = {
  display: 'block',
  backgroundColor: '#f8f8f8',
  marginRight: '-2rem',
  marginLeft: '-2rem',
  height: '1rem'
}

function SectionSplitter(props) {
  return <div style={{ ...style, ...props.style }} />
}

export default SectionSplitter
