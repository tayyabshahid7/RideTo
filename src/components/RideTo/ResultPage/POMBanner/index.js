import React from 'react'
import { useMediaQuery } from 'react-responsive'
const mobile =
  'https://rideto-production.imgix.net/static/images/RideTo+POM+Banner_Mobile-01.jpg?q=80&auto=format,compress,true'
const desktop =
  'https://rideto-production.imgix.net/static/images/RideTo+POM+Banner-02.jpg?q=90&auto=format,compress,true&fit=crop&w=666&max-h=666'

const mobileDiscount =
  'https://rideto-production.imgix.net/static/images/RideTo+POM+Banner_Buy+Now_Mobile_600x300px.jpg?q=80&auto=format,compress,true'
const desktopDiscount =
  'https://rideto-production.imgix.net/static/images/RideTo+POM+Banner_Buy+Now_1000x400px.jpg?q=80&auto=format,compress,true'

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
