import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getCourseTitle } from 'services/course'
import expandImg from 'assets/images/rideto/Expand.svg'
import expandImgWhite from 'assets/images/rideto/AddWhite.svg'
import MediaQuery from 'react-responsive'

function InfoBox({ showCourseTypeInfo, courseType, className }) {
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
        <div className={styles.infoContent}>
          Typically completed between 6 to 8 hours and requiring a base of
          ability and knowledge relating to the UK Highway Code.
        </div>
      </button>
    </div>
  )
}

export default InfoBox
