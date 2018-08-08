import React from 'react'

import styles from './Details.scss'

const Details = ({ profile }) => {
  return (
    <div className={styles.details}>
      <h1 className={styles.heading}>
        <img className={styles.logo} src={profile.logo} />
      </h1>

      <div className={styles.intro}>{profile.intro}</div>

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Address</h3>
        {profile.address}
        <hr />
      </div>

      <div className={styles.block}>
        <h3 className={styles.subHeading}>Requirements</h3>
        {profile.requirements}
        <hr />
      </div>
    </div>
  )
}

export default Details
