import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getCourseTitle } from 'services/course'
import expandImgWhite from 'assets/images/rideto/AddWhite.svg'
import infoWhite from 'assets/icons/InfoWhite.svg'
import MediaQuery from 'react-responsive'
import { getStaticData } from 'services/page'

function InfoBox({ showCourseTypeInfo, courseType, className }) {
  const staticData = getStaticData('RIDETO_PAGE')
  const { details } = staticData.courseTypes.find(
    ({ constant }) => constant === courseType
  )

  return (
    <div className={classnames(styles.infoBox, className)}>
      <MediaQuery query="(max-width: 768px)">
        <button className={styles.infoButton} onClick={showCourseTypeInfo}>
          <span>Course Info</span>
          <span className={styles.infoCircle}>
            <img src={infoWhite} alt="info icon" />
          </span>
          <div className={styles.infoContent}>{details.description}</div>
        </button>
      </MediaQuery>

      <MediaQuery query="(min-width: 769px)">
        <button className={styles.infoButton} onClick={showCourseTypeInfo}>
          <span>
            <span className={styles.infoCircle}>
              <i className="fa fa-info-circle"></i>
            </span>{' '}
            What is {getCourseTitle(courseType)}
            {!getCourseTitle(courseType).includes('Training') && ' Training'}?
          </span>
          <img className={styles.expandWhite} src={expandImgWhite} alt="Open" />
          <div className={styles.infoContent}>{details.description}</div>
        </button>
      </MediaQuery>
    </div>
  )
}

export default InfoBox
