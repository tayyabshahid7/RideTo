import React from 'react'
import Slider from 'react-slick'
import styles from './RideToSlider.scss'

const RideToSlider = ({ children, settings }) => {
  return (
    <Slider className={styles.rideToSlider} {...settings}>
      {children}
    </Slider>
  )
}

export default RideToSlider
