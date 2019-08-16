import React from 'react'

import RideToSlider from 'components/RideToSlider'
import ArrowSlideLeft from 'assets/images/rideto/ArrowSlideLeft.svg'
import ArrowSlideRight from 'assets/images/rideto/ArrowSlideRight.svg'
import styles from './AddonImageSlider.scss'

const NextArrow = ({ onClick }) => (
  <img
    src={ArrowSlideRight}
    className={styles.nextArrow}
    onClick={onClick}
    alt=""
  />
)

const PrevArrow = ({ onClick }) => (
  <img
    src={ArrowSlideLeft}
    className={styles.prevArrow}
    onClick={onClick}
    alt=""
  />
)

const AddonImageSlider = ({ images, addon, onDetails }) => {
  const settings = {
    dots: false,
    slidesToShow: 1,
    // slidesToScroll: 1,
    infinite: false,
    className: styles.slider,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  }

  return (
    <div className={styles.wrap}>
      <RideToSlider settings={settings}>
        {images.map(image => (
          <img
            key={image}
            // src={image}
            src="https://via.placeholder.com/350x150"
            className={styles.addonImage}
            alt=""
            onClick={() => {
              onDetails(addon)
            }}
          />
        ))}
      </RideToSlider>
    </div>
  )
}

export default AddonImageSlider
