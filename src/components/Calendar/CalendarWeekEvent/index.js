import React from 'react'
import styles from './index.scss'
import classnames from 'classnames'
import { getTimeOfDayInSeconds } from 'utils/helper'
import {
  WEEK_VIEW_START_TIME,
  WORK_HOURS,
  CALENDAR_VIEW
} from 'common/constants'

const CalendarWeekEvent = ({ event, position, barCount, calendar, match }) => {
  const secondsForDay = getTimeOfDayInSeconds(event.start_time)
  const duration = getTimeOfDayInSeconds(event.end_time) - secondsForDay

  const isDay = calendar.viewMode === CALENDAR_VIEW.DAY

  let height = duration / 3600
  let startTime = (secondsForDay - WEEK_VIEW_START_TIME) / 3600
  if (startTime < 0) {
    height += startTime
    startTime = 0
  }
  if (startTime + height > WORK_HOURS - 1) {
    height = WORK_HOURS - startTime - 1
    if (height < 0) {
      return null
    }
  }
  let left = `${position * 4}px`
  let width = `calc(100% - ${(barCount - 1) * 4}px)`

  if (isDay) {
    left = `${(100 / barCount) * position}%`
    width = `${100 / barCount}%`
  }

  let style = {
    height: `${height * 56}px`,
    top: `${startTime * 56}px`,
    left,
    width
  }

  return (
    <div
      className={classnames(styles.singleEvent, styles.singleEventEvent)}
      style={style}>
      <div
        className={classnames(styles.content)}
        style={{ backgroundColor: event.colour }}>
        {event.name}
      </div>
    </div>
  )
}

export default CalendarWeekEvent
