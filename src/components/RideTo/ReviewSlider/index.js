import React from 'react'
import classnames from 'classnames'

import RideToSlider from 'components/RideToSlider'
import styles from './ReviewSlider.scss'

import { getStaticData } from 'services/page'

const STAR_RANGE = [0, 1, 2, 3, 4]

const NextArrow = ({ onClick }) => (
  <div
    className={classnames(styles.overlay, styles.nextArrow)}
    onClick={onClick}>
    <div className={styles.arrow}>{'>'}</div>
  </div>
)

const PrevArrow = ({ onClick }) => (
  <div
    className={classnames(styles.overlay, styles.prevArrow)}
    onClick={onClick}>
    <div className={styles.arrow}>{'<'}</div>
  </div>
)

const getStars = count => {
  return (
    <div className={styles.stars}>
      {STAR_RANGE.map(
        index =>
          index < count ? (
            <span className={styles.filledStar}>*</span>
          ) : (
            <span className={styles.emptyStar}>*</span>
          )
      )}
    </div>
  )
}

const ReviewSlider = () => {
  const staticData = getStaticData('RIDETO_PAGE_HOME')
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

  const slides = staticData.reviews.map(review => (
    <a key={review.index}>
      <div className={styles.wrapper}>
        <div className={styles.slide}>
          <img src={review.pic} className={styles.img} alt="Rider" />
          <div className={styles.content}>
            <h5 className={styles.author}>{review.author}</h5>
            <div className={styles.quote}>{review.quote}</div>
            {getStars(review.star)}
          </div>
        </div>
      </div>
    </a>
  ))

  console.log(slides)

  return (
    <div className={styles.reviewSlider}>
      <div className={styles.slider}>
        <RideToSlider settings={settings}>{slides}</RideToSlider>
      </div>
    </div>
  )
}

export default ReviewSlider
