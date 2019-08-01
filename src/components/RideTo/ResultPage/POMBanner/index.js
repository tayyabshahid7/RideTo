import React from 'react'
import { useMediaQuery } from 'react-responsive'
const mobile =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner_Mobile-01.jpg'
const desktop =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner-02.jpg'

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
