import React from 'react'
import { useMediaQuery } from 'react-responsive'
const mobile =
  'https://rideto-production.imgix.net/static/images/RideTo+Keyworker+Banner_600x300px-01.jpg?q=80&auto=format,compress,true'
const tablet =
  'https://rideto-production.imgix.net/static/images/RideTo+Keyworker+Banner_1000x400px-03.jpg?q=80&auto=format,compress,true'
const desktop =
  'https://rideto-production.imgix.net/static/images/RideTo+Keyworker+Banner_1036x312px-02.jpg?q=80&auto=format,compress,true'

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
