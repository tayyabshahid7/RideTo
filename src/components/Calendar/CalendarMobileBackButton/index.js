import React from 'react'
import styles from './styles.scss'
import { CALENDAR_VIEW } from 'common/constants'
import classnames from 'classnames'
import moment from 'moment'

function CalendarMobileBackButton({ handleCustomEvent, viewMode, calendar }) {
  const { year, month, day } = calendar
  const momentDate = moment(`${year}-${month + 1}-${day}`, 'YYYY-M-D')

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
        <i className="fa fa-angle-left" />{' '}
        <span>{momentDate.format('MMMM YYYY')}</span>
      </button>
    </div>
  )
}

export default CalendarMobileBackButton
