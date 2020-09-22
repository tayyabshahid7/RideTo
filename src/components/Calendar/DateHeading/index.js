import React from 'react'
import { Link } from 'react-router-dom'
import CloseButton from 'components/common/CloseButton'

import styles from './DateHeading.scss'

const DateHeading = ({ date, title, subtitle, backLink, onBack }) => {
  return (
    <div className={styles.container}>
      <div className={styles.date}>
        {!!title && <span>{title}</span>}
        {!title && date && date.format('ddd DD MMMM YYYY')}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {!subtitle && backLink && (
        <Link to={backLink} className={styles.backLink}>
          <CloseButton />
        </Link>
      )}
      {onBack && <CloseButton onClick={onBack} />}
    </div>
  )
}

export default DateHeading
