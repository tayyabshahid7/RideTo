import React from 'react'
import CalendarDaycellCourse from './CalendarDaycellCourse'

const CalendarDayCell = ({ day, info, className = '' }) => (
  <li
    className={`day ${className} ${
      day.date.getMonth() !== info.month ? 'other-month' : ''
    }`}>
    <div className="date">{day.date.getDate()}</div>
    {day.courses &&
      day.courses.length > 0 && (
        <div className="courses">
          <CalendarDaycellCourse course={day.courses[0]} />
          {day.courses.length > 1 && (
            <CalendarDaycellCourse course={day.courses[1]} />
          )}
          {day.courses.length > 2 && <div>{day.courses.length - 2} more</div>}
        </div>
      )}
  </li>
)

export default CalendarDayCell
