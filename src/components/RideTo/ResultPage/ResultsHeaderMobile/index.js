import { IconArrowDown, IconCalendarMobile, IconSearch } from 'assets/icons'
import classNames from 'classnames'
import React from 'react'

import styles from './styles.scss'

function ResultsHeaderMobile(props) {
  const courseTitle = 'CBT training'
  const postcode = 'London'
  const miles = `+ ${0} miles`

  const date = 'Choose a Date'

  const handleSearchClick = e => {
    console.log(e)
  }

  const handleChooseADateClick = e => {
    console.log(e)
  }

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.wrapper, styles.searchWrapper)}
        onClick={handleSearchClick}>
        <IconSearch className={classNames(styles.searchIcon, styles.icon)} />
        <strong>{courseTitle}</strong> in <strong>{postcode}</strong>
        <div className={styles.miles}>
          <span>{miles}</span>
          <IconArrowDown className={styles.dropDownIcon} />
        </div>
      </div>
      <div className={styles.divider} />
      <div
        className={classNames(styles.wrapper, styles.wrapperChooseADate)}
        onClick={handleChooseADateClick}>
        <IconCalendarMobile className={styles.icon} />
        <div className={styles.date}>{date}</div>
        <IconArrowDown className={styles.dropDownIcon} />
      </div>
    </div>
  )
}

export default ResultsHeaderMobile
