import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import { getStaticData } from 'services/page'
import ArrowSlideLeft from 'assets/images/rideto/ArrowSlideLeft.svg'
import ArrowSlideRight from 'assets/images/rideto/ArrowSlideRight.svg'
import styles from './CourseSlider.scss'

const NextArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.nextArrow)} onClick={onClick}>
    <img src={ArrowSlideRight} alt="" />
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.prevArrow)} onClick={onClick}>
    <img src={ArrowSlideLeft} alt="" />
  </div>
)

const CourseSlider = () => {
  const settings = {
    customPaging: i => {
      return (
        <a>
          <div className={styles.dot} />
        </a>
      )
    },
    dotsClass: styles.dots,
    className: styles.slider,
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '64px',
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          infinite: false,
          centerPadding: '12px'
        }
      }
    ]
  }

  const staticData = getStaticData('RIDETO_PAGE')
  const slides = staticData.courseTypes || []

  return (
    <RideToSlider settings={settings}>
      {slides.map(slide => (
        <a href={slide.link}>
          <div
            key={slide.id}
            className={styles.slide}
            style={{ backgroundImage: `url(${slide.details.image})` }}>
            <div className={styles.title}>{slide.name}</div>
          </div>
        </a>
      ))}
    </RideToSlider>
  )
}

export default CourseSlider
