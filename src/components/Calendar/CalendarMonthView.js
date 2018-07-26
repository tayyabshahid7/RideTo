import React from 'react'
import CalendarWeekdays from './CalendarWeekdays'
import CalendarDays from './CalendarDays'

const CalendarMonthView = ({ ...props }) => (
  <div className="calendar calendar-month-view">
    <CalendarWeekdays />
    <CalendarDays {...props} />
  </div>
)

export default CalendarMonthView
