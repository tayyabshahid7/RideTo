import React from 'react'
import RideToSlider from 'components/RideToSlider'
import styles from './AddonImageSliderModal.scss'
import { NextArrow, PrevArrow } from '../AddonItemSlider/SliderArrows'
import { useMediaQuery } from 'react-responsive'

const AddonImageSliderModal = ({ images }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const settings = {
    dots: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    arrows: isMobile ? false : true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: styles.slider,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
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
