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
  onLinkClick,
  isTypeform = false
}) => {
  const { details } = courseType

  if (!details) {
    return null
  }

  const bgImg = { backgroundImage: `url(${details.image})` }

  const renderTopLink = children => {
    return !onLinkClick ? (
      <a className={styles.expandedInfo} href={url}>
        {children}
      </a>
    ) : (
      <div
        onClick={() => onLinkClick(courseType)}
        className={styles.expandedInfo}>
        {children}
      </div>
    )
  }

  const renderChooseLink = children => {
    return !onLinkClick ? (
      <a
        className={classnames(styles.cta, isTypeform && 'typeform-share')}
        href={url}>
        {children}
      </a>
    ) : (
      <div
        onClick={() => onLinkClick(courseType)}
        className={classnames(styles.cta, isTypeform && 'typeform-share')}>
        {children}
      </div>
    )
  }

  const renderTypeForm = children => {
    return !onLinkClick ? (
      <a href={url} className={isTypeform ? 'typeform-share' : null}>
        {children}
      </a>
    ) : (
      <div
        onClick={() => onLinkClick(courseType)}
        className={isTypeform ? 'typeform-share' : null}>
        {children}
      </div>
    )
  }

  return (
    <div className={styles.courseTypeItem}>
      <div
        className={styles.infoIcon}
        onClick={() => onClickDetails(courseType)}>
        <span>i</span>
      </div>
      {renderTypeForm(<div className={styles.backgroundImg} style={bgImg} />)}

      <div className={styles.content}>
        {renderTopLink(
          <div className={styles.info}>
            <h5>{courseType.name}</h5>
            <div className={styles.description}>{details.description}</div>
          </div>
        )}
        {renderChooseLink(
          <React.Fragment>
            <div className={styles.ctaText}>Choose</div>
            <img
              className={styles.ctaIcon}
              src={ArrowRight}
              alt="right-arrow"
            />
            <img
              className={styles.ctaIconHover}
              src={ButtonArrowWhite}
              alt="arrow-white"
            />
          </React.Fragment>
        )}
      </div>
      {//Add typeform popup script
      isTypeform && loadTypeformScript()}
    </div>
  )
}

export default CourseTypeItem
