import React from 'react'
import { Link } from 'react-router-dom'
import CloseButton from 'components/common/CloseButton'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children, backLink }) => {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        {!date ? null : date.format('dddd Do MMMM')}
      </div>
      {backLink && (
        <Link to={backLink} className={styles.backLink}>
          <CloseButton />
        </Link>
      )}
    </div>
  )
}

export default DateHeading
