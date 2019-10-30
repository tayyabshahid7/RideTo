import React from 'react'
import styles from '../CalendarDateChanger/styles.scss'
import { CALENDAR_VIEW } from 'common/constants'
import classnames from 'classnames'

function CalendarDateChanger({ viewMode, handleCustomEvent }) {
  const handleSelectChange = event => {
    const {
      target: { value }
    } = event

    handleCustomEvent('change-calendar-setting', {
      viewMode: value
    })
  }

  return (
    <div className={styles.container}>
      <select
        value={viewMode}
        className={classnames(styles.select, styles.viewModeChange)}
        onChange={handleSelectChange}>
        <option value={CALENDAR_VIEW.WEEK}>Week</option>
        <option value={CALENDAR_VIEW.MONTH}>Month</option>
      </select>
    </div>
  )
}

export default CalendarDateChanger
