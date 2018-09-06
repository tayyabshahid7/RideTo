import React from 'react'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children }) => {
  return (
    <div className={styles.dateHeading}>
      {title ? title : date.format('dddd Do MMMM')}
      <div className={styles.actions}>{children}</div>
    </div>
  )
}

export default DateHeading
