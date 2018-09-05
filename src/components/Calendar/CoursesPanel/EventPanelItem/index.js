import React from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import styles from './EventPanelItem.scss'
import { getTime } from 'utils/helper'

const EventPanelItem = ({ event, date }) => {
  const { notes = '' } = event
  const truncated = notes.length > 200 ? `${notes}...` : notes

  return (
    <div className={styles.eventsPanelItem}>
      <div className={styles.heading}>
        <div className={styles.title}>
          <div className={styles.time}>
            {getTime(event.start_time)} - {getTime(event.end_time)}
          </div>
          <div className={styles.name}>{event.name}</div>
          {notes && <div className={styles.notes}>{truncated}</div>}
        </div>
        <Button
          tag={Link}
          outline
          color="primary"
          to={`/calendar/events/${event.id}/edit`}>
          Edit
        </Button>
      </div>
    </div>
  )
}

export default EventPanelItem
