import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getCourseTitle } from 'services/course'
import expandImg from 'assets/images/rideto/Expand.svg'
import expandImgWhite from 'assets/images/rideto/AddWhite.svg'
import MediaQuery from 'react-responsive'
import { getStaticData } from 'services/page'

function InfoBox({ showCourseTypeInfo, courseType, className }) {
  const staticData = getStaticData('RIDETO_PAGE')
  const { details } = staticData.courseTypes.find(
    ({ constant }) => constant === courseType
  )

  return (
    <div className={classnames(styles.infoBox, className)}>
      <button className={styles.infoButton} onClick={showCourseTypeInfo}>
        <span>
          <span className={styles.infoCircle}>
            <i className="fa fa-info-circle"></i>
          </span>{' '}
          What is {getCourseTitle(courseType)}
          {!getCourseTitle(courseType).includes('Training') && ' Training'}?
        </span>
        <MediaQuery query="(max-width: 768px)">
          <img src={expandImg} alt="Open" />
        </MediaQuery>
        <MediaQuery query="(min-width: 769px)">
          <img className={styles.expandWhite} src={expandImgWhite} alt="Open" />
        </MediaQuery>
        <div className={styles.infoContent}>{details.description}</div>
      </button>
    </div>
  )
}

export default InfoBox
