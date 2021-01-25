import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import styles from './SupplierCourseImageSlider.scss'

const NextArrow = ({ onClick }) => (
  <span className={styles.nextArrow} onClick={onClick}></span>
)

const PrevArrow = ({ onClick }) => (
  <span className={styles.prevArrow} onClick={onClick}></span>
)

const SupplierCourseImageSlider = ({ images }) => {
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
    <div className={classnames('addon-image-slider course-image-slider', styles.wrap)}>
      <RideToSlider settings={settings}>
        {images.map(image => (
          <img
            key={image}
            src={image}
            className={styles.image}
            alt=""
            onClick={() => {}}
          />
        ))}
      </RideToSlider>
    </div>
  )
}

export default SupplierCourseImageSlider
