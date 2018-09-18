import React from 'react'

import styles from './CourseTypeItem.scss'

const CourseTypeItem = ({ courseType }) => {
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
          <a href="#" className={styles.details}>
            Details
          </a>
        </div>
        <div className={styles.cta}>
          <div className={styles.ctaText}>Choose</div>
          <div className={styles.ctaIcon}>→</div>
        </div>
      </div>
    </div>
  )
}

export default CourseTypeItem
