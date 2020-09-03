import React from 'react'
import styles from './index.scss'
import classnames from 'classnames'
import { calculateDimension } from 'utils/helper'
import { CALENDAR_VIEW } from 'common/constants'

const CalendarWeekEvent = ({ event, barCount, showDetail, calendar }) => {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  const isDay = calendar.viewMode === CALENDAR_VIEW.DAY
  const style = calculateDimension(
    event,
    isDesktop,
    isDay,
    barCount,
    showDetail
  )

  return (
    <div
      className={classnames(styles.singleEvent, styles.singleEventEvent)}
      style={style}>
      <div
        className={classnames(styles.content)}
        style={{ backgroundColor: event.colour }}>
        <span className={styles.eventName}>{event.name}</span>
        {showDetail && !!event.supplierName && (
          <div className={styles.eventSupplier}>{event.supplierName}</div>
        )}
      </div>
    </div>
  )
}

export default CalendarWeekEvent
