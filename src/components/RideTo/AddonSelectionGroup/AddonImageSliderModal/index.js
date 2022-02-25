import React from 'react'
import RideToSlider from 'components/RideToSlider'
import styles from './AddonImageSliderModal.scss'

const AddonImageSliderModal = ({ images }) => {
  // const nextClick = e => {
  //   console.log(e)
  // }

  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
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
