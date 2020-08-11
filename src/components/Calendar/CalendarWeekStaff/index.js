import React from 'react'
import styles from './index.scss'
import classnames from 'classnames'
import CalendarShiftIcon from '../CalendarShiftIcon'
import { CALENDAR_VIEW } from 'common/constants'

const CalendarWeekStaff = ({ staff, position, barCount, calendar, match }) => {
  const isDay = calendar.viewMode === CALENDAR_VIEW.DAY

  const startTime = 0
  const height = 20 - 7

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
      className={classnames(
        styles.singleEvent,
        styles.singleEventEvent,
        parseInt(match.params.id) === staff.id &&
          match.params.type === 'staff' &&
          styles.clickedCourse
      )}
      style={style}>
      <div className={classnames(styles.content)}>
        <CalendarShiftIcon diary={staff} />
        {/* {isDay && <div>{staff.start_time.substr(11, 5)}</div>} */}
      </div>
    </div>
  )
}

export default CalendarWeekStaff
