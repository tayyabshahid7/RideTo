import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { CALENDAR_VIEW } from 'common/constants'

function CalendarDateChanger({ viewMode, handleCustomEvent }) {
  const handleChange = viewMode => {
    handleCustomEvent('change-calendar-setting', {
      viewMode
    })
  }

  return (
    <div className={styles.container}>
      <div
        className={classnames({
          'generic-button': true,
          active: viewMode === CALENDAR_VIEW.DAY
        })}
        onClick={() => handleChange(CALENDAR_VIEW.DAY)}>
        Day
      </div>
      <div
        className={classnames({
          'generic-button': true,
          active: viewMode === CALENDAR_VIEW.WEEK
        })}
        onClick={() => handleChange(CALENDAR_VIEW.WEEK)}>
        Week
      </div>
      <div
        className={classnames({
          'generic-button': true,
          active: viewMode === CALENDAR_VIEW.MONTH
        })}
        onClick={() => handleChange(CALENDAR_VIEW.MONTH)}>
        Month
      </div>
      <div
        className={classnames({
          'generic-button': true,
          active: viewMode === CALENDAR_VIEW.SHIFT
        })}
        onClick={() => handleChange(CALENDAR_VIEW.SHIFT)}>
        Shift
      </div>
    </div>
  )
}

export default CalendarDateChanger
