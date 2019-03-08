import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children, backLink }) => {
  return (
    <Fragment>
      {backLink && (
        <Link to={backLink} className={styles.backLink}>
          <i className="fa fa-times" />
        </Link>
      )}
      <div className={styles.dateHeading}>
        {title ? title : date.format('dddd Do MMMM')}
        <div className={styles.actions}>{children}</div>
      </div>
    </Fragment>
  )
}

export default DateHeading
