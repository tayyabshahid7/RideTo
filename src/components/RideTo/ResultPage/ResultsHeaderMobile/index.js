import {
  IconArrowDown,
  IconCalendarMobile,
  IconClear,
  IconSearch
} from 'assets/icons'
import classNames from 'classnames'
import moment from 'moment'

import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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

  const location = useLocation()
  const history = useHistory()

  const dateParam = new URLSearchParams(window.location.search).get('date')

  const courseTitle = getCourseTitle(courseType)
  const miles = radius_miles === '1' ? '+ 0 miles' : `+ ${radius_miles} miles`

  const date = moment(dateParam, 'YYYY-MM-DD')

  const formattedDate = date.isValid()
    ? moment(dateParam).format('dddd MMMM D, YYYY')
    : 'Choose a Date'

  const classes = `${styles.date} ${date.isValid() ? styles.dateBlacked : ''}`

  const handleSearchClick = () => {
    setSearchModal(!searchModal)
  }

  const handleOnCloseSearchModal = e => {
    setSearchModal(!searchModal)
  }

  function handleOnCloseCalendarModal() {
    setChooseADateModal(!chooseADateModal)
  }

  function handleChooseADateClick() {
    setChooseADateModal(!chooseADateModal)
  }

  function handleClearDate() {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.has('date')) {
      queryParams.delete('date')
      history.replace({
        search: queryParams.toString()
      })
      window.location = history.location.search
    }
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
          <div style={{ display: 'flex' }}>
            <IconCalendarMobile className={styles.icon} />
            <div className={classes}>{formattedDate}</div>
          </div>
          <div
            className={classNames(
              styles.iconsWrapper,
              date.isValid() && styles.spacing
            )}>
            {date.isValid() && (
              <IconClear
                className={styles.iconClear}
                onClick={e => {
                  e.stopPropagation()
                  handleClearDate()
                }}
              />
            )}
            <IconArrowDown className={styles.dropDownIcon} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultsHeaderMobile
