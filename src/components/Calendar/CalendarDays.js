import React from 'react'
import CalendarDayCell from './CalendarDayCell'

const CalendarDays = ({ days, info }) => (
  <ul className="days">
    {days.map((day, index) => (
      <CalendarDayCell day={day} info={info} key={index} />
    ))}
  </ul>
)

export default CalendarDays
