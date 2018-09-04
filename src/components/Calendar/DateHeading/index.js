import React from 'react'

import styles from './DateHeading.scss'

const DateHeading = ({ date, children }) => {
  return (
    <div className={styles.dateHeading}>
      {date.format('dddd Do MMMM')}
      <div className={styles.actions}>{children}</div>
    </div>
  )
}

export default DateHeading
