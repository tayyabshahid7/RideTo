import React from 'react'
import styles from './styles.scss'

function UpComingCourse() {
  return (
    <div className={styles.container}>
      <h3 className={styles.subtitle}>Your course</h3>
      <div>
        <h4>Course</h4>
        <p>Full Licence (40 Hours)</p>
      </div>
      <div>
        <h4>Location</h4>
        <p>
          <a href="/">16 Lodge Creset, BR6 0QF</a>
        </p>
      </div>
      <div>
        <h4>Date & time</h4>
        <p>Within 3 days</p>
      </div>
    </div>
  )
}

export default UpComingCourse
