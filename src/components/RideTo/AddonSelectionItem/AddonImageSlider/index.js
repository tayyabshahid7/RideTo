import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import ArrowSlideLeftBlack from 'assets/images/rideto/ArrowSlideLeftBlack.svg'
import ArrowSlideRightBlack from 'assets/images/rideto/ArrowSlideRightBlack.svg'
import styles from './AddonImageSlider.scss'

const NextArrow = ({ onClick }) => (
  <span className={styles.nextArrow} onClick={onClick}>
    <img src={ArrowSlideRightBlack} alt="" />
  </span>
)

const PrevArrow = ({ onClick }) => (
  <span className={styles.prevArrow} onClick={onClick}>
    <img src={ArrowSlideLeftBlack} alt="" />
  </span>
)

const AddonImageSlider = ({ images, addon, onDetails }) => {
  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    className: styles.slider,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  }

  return (
    <div className={classnames('addon-image-slider', styles.wrap)}>
      <RideToSlider settings={settings}>
        {images.map(image => (
          <img
            key={image}
            src={image}
            // src="https://via.placeholder.com/150"
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
