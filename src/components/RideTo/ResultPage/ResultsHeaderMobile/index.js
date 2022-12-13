import { IconCalendarMobile } from 'assets/icons'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

import styles from './styles.scss'

function ResultsHeaderMobile(props) {
  const courseTitle = 'CBT training'
  const postcode = 'CR6 9EE'

  const date = 'Choose a date'

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AiOutlineSearch className={styles.searchIcon} />
        <strong>{courseTitle}</strong> in <strong>{postcode}</strong>
      </div>
      <div className={styles.wrapper}>
        <IconCalendarMobile />
        <div>{date}</div>
      </div>
    </div>
  )
}

export default ResultsHeaderMobile
