import React from 'react'
import Slider from 'react-slick'

import { getStaticData } from 'services/page'
import styles from './CourseSlider.scss'

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
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true
  }

  const staticData = getStaticData('RIDETO_PAGE_HOME')
  const slides = staticData.carouselSlides

  return (
    <Slider {...settings}>
      {slides.map(slide => <img src={slide.image} />)}
    </Slider>
  )
}

export default CourseSlider
