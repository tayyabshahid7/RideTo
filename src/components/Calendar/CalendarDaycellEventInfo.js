import React from 'react'
import s from '../../utils/helper'

const CalendarDayCell = ({ event }) => (
  <div className="event">
    <div className="event-desc">
      {event.type} | {event.time}
    </div>
    <div
      className={`event-space ${event.available_spaces === 0 ? 'full' : ''}`}>
      {event.available_spaces === 0
        ? 'FULL'
        : `${event.available_spaces} space${s(
            event.available_spaces
          )} available`}
    </div>
  </div>
)

export default CalendarDayCell
