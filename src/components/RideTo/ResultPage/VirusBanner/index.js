import React from 'react'
import { useMediaQuery } from 'react-responsive'
const mobile =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+Keyworker+Banner_600x300px-01.jpg'
const tablet =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+Keyworker+Banner_1000x400px-03.jpg'
const desktop =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/RideTo+Keyworker+Banner_1036x312px-02.jpg'

const style = {
  width: '100%',
  height: 'auto',
  marginBottom: '24px',
  maxWidth: '666px'
}

function VirusBanner() {
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })
  const isMobile = useMediaQuery({
    query: '(max-width: 425px)'
  })

  return (
    <a href="https://www.rideto.com/blog/coronavirus-motorcycling-update">
      <img
        style={style}
        src={isDesktop ? desktop : isMobile ? mobile : tablet}
        alt="Virus Update"
      />
    </a>
  )
}

export default VirusBanner