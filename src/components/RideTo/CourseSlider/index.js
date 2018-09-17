import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import { getStaticData } from 'services/page'
import styles from './CourseSlider.scss'

const NextArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.nextArrow)} onClick={onClick}>
    {'>'}
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div className={classnames(styles.arrow, styles.prevArrow)} onClick={onClick}>
    {'<'}
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
          slidesToShow: 1
        }
      }
    ]
  }

  const staticData = getStaticData('RIDETO_PAGE_HOME')
  const slides = staticData.carouselSlides

  return (
    <RideToSlider settings={settings}>
      {slides.map(slide => (
        <a href={slide.link}>
          <div
            className={styles.slide}
            style={{ backgroundImage: `url(${slide.image})` }}>
            <div className={styles.title}>{slide.title}</div>
          </div>
        </a>
      ))}
    </RideToSlider>
  )
}

export default CourseSlider
