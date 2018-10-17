import React from 'react'
// import classnames from 'classnames'
import styles from './SummaryIcons.scss'
import * as summaryIcons from 'assets/icons/courseSummary'
import { getFiltersTag } from 'services/course-type'

const getTagImage = tag => {
  let image = null
  switch (tag) {
    case '1 day course':
      image = summaryIcons.oneDayCourse
      break
    case 'Multi day course':
      image = summaryIcons.multiDate
      break
    case 'RideTo Experience':
      image = summaryIcons.ridetoExperience
      break
    case 'Ideal for beginners':
      image = summaryIcons.idealBegginers
      break
    case 'For experienced riders':
      image = summaryIcons.experiencedRiders
      break
    case 'Full Licence holders':
      image = summaryIcons.fullLicence
      break
    case 'Back to biking':
      image = summaryIcons.backToBiking
      break
    case 'CBT holders':
      image = summaryIcons.cbt
      break
    default:
      break
  }

  return image
}

const filters = getFiltersTag()

const SummaryIcons = ({ tags }) => {
  return (
    <div class={styles.container}>
      {tags.map(tag => {
        return (
          !filters.includes(tag) && (
            <div key={tag} className={styles.tag}>
              <img src={getTagImage(tag)} className={styles.icon} alt="Rider" />
              <div className={styles.summary}>{tag}</div>
            </div>
          )
        )
      })}
    </div>
  )
}

export default SummaryIcons
