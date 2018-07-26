import React from 'react'
import CalendarWeekdays from './CalendarWeekdays'
import CalendarDays from './CalendarDays'

const CalendarWeekView = ({ ...props }) => (
  <div className="calendar calendar-week-view">
    <CalendarWeekdays />
    <CalendarDays {...props} />
  </div>
)

export default CalendarWeekView
