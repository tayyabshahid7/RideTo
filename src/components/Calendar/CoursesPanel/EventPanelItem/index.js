import React from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import styles from './EventPanelItem.scss'
import { getTime } from 'utils/helper'

const EventPanelItem = ({ event, date }) => {
  return (
    <div className={styles.eventsPanelItem}>
      <div className={styles.heading}>
        <div className={styles.title}>
          <div>
            {getTime(event.start_time)} - {getTime(event.end_time)} |{' '}
            {event.name}
          </div>
          {event.notes && <div className={styles.notes}>{event.notes}</div>}
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
