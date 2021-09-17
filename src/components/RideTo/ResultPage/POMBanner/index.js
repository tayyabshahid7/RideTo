import React from 'react'
import { useMediaQuery } from 'react-responsive'
const mobile =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner_Mobile-01.jpg'
const desktop =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner-02.jpg'

const mobileDiscount =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner_Buy+Now_Mobile_600x300px.jpg'
const desktopDiscount =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+POM+Banner_Buy+Now_1000x400px.jpg'

const style = {
  width: '100%',
  height: 'auto',
  marginBottom: '24px',
  maxWidth: '666px'
}

function POMBanner({ discount }) {
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })

  if (discount) {
    return (
      <img
        loading="lazy"
        style={style}
        src={isDesktop ? desktopDiscount : mobileDiscount}
        alt="Book a POM"
      />
    )
  }

  return (
    <img
      loading="lazy"
      style={style}
      src={isDesktop ? desktop : mobile}
      alt="Book a POM"
    />
  )
}

export default POMBanner
