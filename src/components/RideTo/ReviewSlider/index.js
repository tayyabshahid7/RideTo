import React from 'react'
import classnames from 'classnames'

import StarsComponent from 'components/RideTo/StarsComponent'
import RideToSlider from 'components/RideToSlider'
import ArrowSlideLeft from 'assets/images/rideto/ArrowSlideLeft.svg'
import ArrowSlideRight from 'assets/images/rideto/ArrowSlideRight.svg'
import styles from './ReviewSlider.scss'

import { getStaticData } from 'services/page'

const NextArrow = ({ onClick }) => (
  <div
    className={classnames(styles.overlay, styles.nextArrow)}
    onClick={onClick}>
    <div className={styles.arrow}>
      <img src={ArrowSlideRight} alt="" />
    </div>
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div
    className={classnames(styles.overlay, styles.prevArrow)}
    onClick={onClick}>
    <div className={styles.arrow}>
      <img src={ArrowSlideLeft} alt="" />
    </div>
  </div>
)

const ReviewSlider = () => {
  const staticData = getStaticData('RIDETO_PAGE')
  const settings = {
    customPaging: i => {
      return (
        <a>
          <div className={styles.dot} />
        </a>
      )
    },
    className: styles.slider,
    dotsClass: styles.dots,
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '24px',
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

  const slides = staticData.reviews.map(review => (
    <div className={styles.wrapper} key={review.index}>
      <div className={styles.slide}>
        <img src={review.pic} className={styles.img} alt="Rider" />
        <div className={styles.content}>
          <h5 className={styles.author}>{review.author}</h5>
          <div className={styles.quote}>{review.quote}</div>
          <StarsComponent rating={review.star} />
        </div>
      </div>
    </div>
  ))

  return (
    <div className={styles.reviewSlider}>
      <div className={styles.slider}>
        <RideToSlider settings={settings}>{slides}</RideToSlider>
      </div>
    </div>
  )
}

export default ReviewSlider
