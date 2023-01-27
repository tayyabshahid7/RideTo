import { IconArrowDown, IconCalendarMobile, IconSearch } from 'assets/icons'
import classNames from 'classnames'
import moment from 'moment'

import React, { useState } from 'react'
import { getCourseTitle } from 'services/course'
import CalendarModal from './CalendarModal'
import SearchModal from './SearchModal'

import styles from './styles.scss'

function ResultsHeaderMobile({
  courseTypesOptions,
  postcode,
  courseType,
  radius_miles
}) {
  const [searchModal, setSearchModal] = useState(false)
  const [chooseADateModal, setChooseADateModal] = useState(false)

  const dateParam = new URLSearchParams(window.location.search).get('date')

  const courseTitle = getCourseTitle(courseType)
  const miles = radius_miles === '1' ? '+ 0 miles' : `+ ${radius_miles} miles`

  const date = moment(dateParam, 'YYYY-MM-DD')

  const formattedDate = date.isValid()
    ? moment(dateParam).format('ll')
    : 'Choose a Date'

  const handleSearchClick = () => {
    setSearchModal(!searchModal)
  }

  const handleOnCloseSearchModal = e => {
    setSearchModal(!searchModal)
  }

  function handleOnCloseCalendarModal() {
    setChooseADateModal(!chooseADateModal)
  }

  const handleChooseADateClick = e => {
    setChooseADateModal(!chooseADateModal)
  }

  return (
    <>
      <SearchModal
        isOpen={searchModal}
        onClose={handleOnCloseSearchModal}
        onSearch={handleSearchClick}
        courseTypesOptions={courseTypesOptions}
      />

      <CalendarModal
        isOpen={chooseADateModal}
        onClose={handleOnCloseCalendarModal}
      />

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
          <div className={styles.date}>{formattedDate}</div>
          <IconArrowDown className={styles.dropDownIcon} />
        </div>
      </div>
    </>
  )
}

export default ResultsHeaderMobile
