import React from 'react'

import styles from './CourseTypeItem.scss'

const CourseTypeItem = ({ courseType, url, onClickDetails }) => {
  const { details } = courseType

  if (!details) {
    return null
  }

  const bgImg = { backgroundImage: `url(${details.image})` }

  return (
    <div className={styles.courseTypeItem}>
      <div className={styles.backgroundImg} style={bgImg} />

      <div className={styles.content}>
        <div className={styles.expandedInfo}>
          <div className={styles.info}>
            <h5>{courseType.name}</h5>
            <div className={styles.description}>{details.description}</div>
          </div>
          <a
            className={styles.details}
            onClick={() => onClickDetails(courseType)}>
            Details
          </a>
        </div>
        <a className={styles.cta} href={url}>
          <div className={styles.ctaText}>Choose</div>
          <div className={styles.ctaIcon}>→</div>
        </a>
      </div>
    </div>
  )
}

export default CourseTypeItem
