import React from 'react'
import RideToSlider from 'components/RideToSlider'
import styles from './AddonImageSliderModal.scss'
import { NextArrow, PrevArrow } from '../AddonItemSlider/SliderArrows'
import { useMediaQuery } from 'react-responsive'

const AddonImageSliderModal = ({ images }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: isMobile ? false : true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: styles.slider
  }

  return (
    <div className={styles.wrap}>
      <RideToSlider settings={settings}>
        {images.map(image => (
          <img
            key={image}
            src={image}
            className={styles.addonImage}
            alt="Addon"
          />
        ))}
      </RideToSlider>
    </div>
  )
}

export default AddonImageSliderModal
