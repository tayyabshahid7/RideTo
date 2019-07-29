import React from 'react'
import { useMediaQuery } from 'react-responsive'

const style = {
  display: 'block',
  backgroundColor: '#f3f3f3',
  marginRight: '-2rem',
  marginLeft: '-2rem',
  height: '1rem'
}

const styleDesktop = {
  ...style,
  marginRight: '-2.5rem',
  marginLeft: '-2.5rem',
  height: '1.5rem'
}

function SectionSplitter({ hideDesktop }) {
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })

  if (isDesktop && hideDesktop) {
    return null
  }

  return <div style={isDesktop ? styleDesktop : style} />
}

export default SectionSplitter
