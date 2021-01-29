import React from 'react'
import classnames from 'classnames'
import { SupplierContext } from '../supplier-context'
import RideToSlider from 'components/RideToSlider'
import styles from './SupplierCourseImageSlider.scss'

const NextArrow = ({ onClick }) => (
  <span className={styles.nextArrow} onClick={onClick}></span>
)

const PrevArrow = ({ onClick }) => (
  <span className={styles.prevArrow} onClick={onClick}></span>
)

const SupplierCourseImageSlider = () => {
  const { supplier } = React.useContext(SupplierContext)
  const images = [supplier.image, supplier.image2, supplier.image3].filter(
    x => x
  )

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
    <div
      className={classnames(
        'addon-image-slider course-image-slider',
        styles.wrap
      )}>
      <RideToSlider settings={settings}>
        {images.map(image => (
          <div key={image} className={styles.image}>
            <img src={image} alt="Course" />
          </div>
        ))}
      </RideToSlider>
    </div>
  )
}

export default SupplierCourseImageSlider
