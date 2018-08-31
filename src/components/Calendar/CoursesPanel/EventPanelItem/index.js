import React from 'react'
import { Link } from 'react-router-dom'
import styles from './EventPanelItem.scss'
import { getStarTimeForEventForDate } from 'utils/helper'

const EventPanelItem = ({ event, date }) => {
  return (
    <div className={styles.eventsPanelItem}>
      <div className={styles.time}>
        {getStarTimeForEventForDate(event, date)}
      </div>
      <div className={styles.content}>
        <div className={styles.heading}>
          <div className={styles.title}>{event.name}</div>
          <Link to={`/calendar/events/${event.id}/edit`}>Edit</Link>
        </div>
      </div>
    </div>
  )
}

export default EventPanelItem
