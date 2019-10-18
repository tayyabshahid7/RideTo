import React from 'react'
import styles from './styles.scss'
import { CALENDAR_VIEW } from 'common/constants'
import classnames from 'classnames'

function CalendarMobileBackButton({ handleCustomEvent, viewMode }) {
  return (
    <div
      className={classnames(
        styles.mobileBackToMonth,
        viewMode === CALENDAR_VIEW.MONTH && styles.hidden
      )}>
      <button
        onClick={() => {
          handleCustomEvent('change-calendar-setting', {
            viewMode: CALENDAR_VIEW.MONTH
          })
        }}>
        <i className="fa fa-angle-left" /> <span>February 2019</span>
      </button>
    </div>
  )
}

export default CalendarMobileBackButton
