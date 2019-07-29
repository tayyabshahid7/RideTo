import React from 'react'
import { useMediaQuery } from 'react-responsive'
import mobile from 'assets/images/results-pom-mobile.jpg'
import desktop from 'assets/images/results-pom-desktop.jpg'

const style = {
  width: '100%',
  height: 'auto',
  marginBottom: '24px'
}

function POMBanner() {
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })

  return (
    <img style={style} src={isDesktop ? desktop : mobile} alt="Book a POM" />
  )
}

export default POMBanner
