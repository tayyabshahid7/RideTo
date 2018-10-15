import React from 'react'

import styles from './CourseTypeItem.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import Info from 'assets/images/rideto/Info.svg'

const CourseTypeItem = ({ courseType, url, onClickDetails }) => {
  const { details } = courseType

  if (!details) {
    return null
  }

  const bgImg = { backgroundImage: `url(${details.image})` }

  return (
    <div className={styles.courseTypeItem}>
      <a href={url}>
        <div className={styles.backgroundImg} style={bgImg} />
      </a>

      <div className={styles.content}>
        <div className={styles.expandedInfo}>
          <div className={styles.info}>
            <h5>{courseType.name}</h5>
            <div className={styles.description}>{details.description}</div>
          </div>
          <div
            className={styles.details}
            onClick={() => onClickDetails(courseType)}>
            <img src={Info} alt="Info" />Details
          </div>
        </div>
        <a className={styles.cta} href={url}>
          <div className={styles.ctaText}>Choose</div>
          <img className={styles.ctaIcon} src={ArrowRight} alt="right-arrow" />
          <img
            className={styles.ctaIconHover}
            src={ButtonArrowWhite}
            alt="arrow-white"
          />
        </a>
      </div>
    </div>
  )
}

export default CourseTypeItem
