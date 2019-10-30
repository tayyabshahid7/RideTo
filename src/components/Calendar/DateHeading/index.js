import React from 'react'
import { Link } from 'react-router-dom'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children, backLink }) => {
  return (
    <React.Fragment>
      <div className={styles.container}>
        {backLink && (
          <Link to={backLink} className={styles.backLink}>
            <i className="fa fa-times" />
          </Link>
        )}
        <div className={styles.dateHeading}>
          <span className={styles.date}>
            {!date ? null : date.format('dddd Do MMMM')}
          </span>
        </div>
      </div>
      <div className={styles.actions}>{children}</div>
    </React.Fragment>
  )
}

export default DateHeading
