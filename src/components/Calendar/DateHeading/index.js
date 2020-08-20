import React from 'react'
import { Link } from 'react-router-dom'
import CloseButton from 'components/common/CloseButton'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, children, backLink, onBack }) => {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        {!date ? null : date.format('ddd DD MMMM YYYY')}
      </div>
      {backLink && (
        <Link to={backLink} className={styles.backLink}>
          <CloseButton />
        </Link>
      )}
      {onBack && <CloseButton onClick={onBack} />}
    </div>
  )
}

export default DateHeading
