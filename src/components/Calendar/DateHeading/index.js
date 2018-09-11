import React from 'react'
import { Link } from 'react-router-dom'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children, backLink }) => {
  return (
    <div className={styles.dateHeading}>
      {backLink && (
        <Link to={backLink} className={styles.backLink}>
          <i className="fa fa-arrow-left" />
        </Link>
      )}
      {title ? title : date.format('dddd Do MMMM')}
      <div className={styles.actions}>{children}</div>
    </div>
  )
}

export default DateHeading
