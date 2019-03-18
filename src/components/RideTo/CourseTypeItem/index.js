import React from 'react'

import styles from './CourseTypeItem.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ArrowRight from 'assets/images/rideto/ButtonArrowWhite.svg'
import classnames from 'classnames'

import { loadTypeformScript } from 'utils/helper'

const CourseTypeItem = ({
  courseType,
  url,
  onClickDetails,
  isTypeform = false
}) => {
  const { details } = courseType

  if (!details) {
    return null
  }

  const bgImg = { backgroundImage: `url(${details.image})` }

  return (
    <div className={styles.courseTypeItem}>
      <div
        className={styles.infoIcon}
        onClick={() => onClickDetails(courseType)}>
        <span>i</span>
      </div>
      <a href={url} className={isTypeform ? 'typeform-share' : null}>
        <div className={styles.backgroundImg} style={bgImg} />
      </a>

      <div className={styles.content}>
        <a className={styles.expandedInfo} href={url}>
          <div className={styles.info}>
            <h5>{courseType.name}</h5>
            <div className={styles.description}>{details.description}</div>
          </div>
        </a>
        <a
          className={classnames(styles.cta, isTypeform && 'typeform-share')}
          href={url}>
          <div className={styles.ctaText}>Choose</div>
          <img className={styles.ctaIcon} src={ArrowRight} alt="right-arrow" />
          <img
            className={styles.ctaIconHover}
            src={ButtonArrowWhite}
            alt="arrow-white"
          />
        </a>
      </div>
      {//Add typeform popup script
      isTypeform && loadTypeformScript()}
    </div>
  )
}

export default CourseTypeItem
