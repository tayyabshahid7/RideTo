import React from 'react'

import styles from './CourseTypeItem.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ArrowRight from 'assets/images/rideto/ButtonArrowWhite.svg'
import Info from 'assets/images/rideto/Info.svg'
import classnames from 'classnames'

const CourseTypeItem = ({
  courseType,
  url,
  onClickDetails,
  isFullLicence = false
}) => {
  const { details } = courseType

  if (!details) {
    return null
  }

  const bgImg = { backgroundImage: `url(${details.image})` }

  return (
    <div className={styles.courseTypeItem}>
      <a href={url} className={isFullLicence ? 'typeform-share' : null}>
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
        <a
          className={classnames(styles.cta, isFullLicence && 'typeform-share')}
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
      isFullLicence &&
        (function() {
          var js,
            q,
            d = document,
            gi = d.getElementById,
            ce = d.createElement,
            gt = d.getElementsByTagName,
            id = 'typef_orm_share',
            b = 'https://embed.typeform.com/'
          if (!gi.call(d, id)) {
            js = ce.call(d, 'script')
            js.id = id
            js.src = b + 'embed.js'
            q = gt.call(d, 'script')[0]
            q.parentNode.insertBefore(js, q)
          }
        })()}
    </div>
  )
}

export default CourseTypeItem
