import React from 'react'

const CalendarDayCell = ({ day, info, className = '' }) => (
  <li
    className={`day ${className} ${
      day.date.getMonth() !== info.month ? 'other-month' : ''
    }`}>
    <div className="date">{day.date.getDate()}</div>
    {day.events &&
      day.events.length > 0 && (
        <div className="event">
          <div className="event-desc">
            HTML 5 lecture with Brad Traversy from Eduonix
          </div>
          <div className="event-time">1:00pm to 3:00pm</div>
        </div>
      )}
  </li>
)

export default CalendarDayCell
