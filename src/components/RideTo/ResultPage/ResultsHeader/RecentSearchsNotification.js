import React from 'react'
import styles from './styles.scss'
import getStartedFaster from 'assets/images/rideto/getStartedFaster.svg'

function RecentSearchsNotification({ location, searchForLocationRequests }) {
  return (
    <div className={styles.recentSearchContainer}>
      <img
        className={styles.recentSearchIcon}
        alt="clock icon"
        src={getStartedFaster}
      />
      <div className={styles.recentSearchText}>
        <strong>{`Courses in ${location} are filling up fast!`} </strong>
        <span>{`People are searching ${Math.round(
          searchForLocationRequests
        )}+% more this week.`}</span>
      </div>
    </div>
  )
}

export default RecentSearchsNotification