import { IconArrowDown, IconCalendarMobile, IconSearch } from 'assets/icons'
import classNames from 'classnames'
import React, { useState } from 'react'
import { getCourseTitle } from 'services/course'
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

  const courseTitle = getCourseTitle(courseType)
  const miles = radius_miles === '1' ? '+ 0 miles' : `+ ${radius_miles} miles`

  const date = 'Choose a Date'

  const handleSearchClick = () => {
    setSearchModal(!searchModal)
  }

  const handleOnCloseSearchModal = e => {
    setSearchModal(!searchModal)
  }

  const handleChooseADateClick = e => {
    setChooseADateModal(!chooseADateModal)
  }

  return (
    <>
      {searchModal && (
        <SearchModal
          isOpen={searchModal}
          onClose={handleOnCloseSearchModal}
          onSearch={handleSearchClick}
          courseTypesOptions={courseTypesOptions}
        />
      )}
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
    </>
  )
}

export default ResultsHeaderMobile
