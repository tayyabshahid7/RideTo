import React from 'react'
import classnames from 'classnames'
import styles from './EventPanelItem.scss'
import { getTimeFromDateTime } from 'utils/helper'

const EventPanelItem = ({ event, date, eventId }) => {
  const { notes = '' } = event
  const truncated = notes.length > 200 ? `${notes}...` : notes
  const isSelected = parseInt(eventId) === event.id

  return (
    <div className={styles.eventsPanelItem}>
      <div
        className={classnames(
          styles.heading,
          isSelected && styles.headingSelected
        )}>
        <div className={styles.title}>
          <div className={styles.body}>
            <div className={styles.time}>
              {getTimeFromDateTime(event.start_time)} -{' '}
              {getTimeFromDateTime(event.end_time)}
            </div>
            <div className={styles.name}>{event.name}</div>
            {notes && <div className={styles.notes}>{truncated}</div>}
          </div>
          <a
            className={styles.editLink}
            href={`/calendar/${date}/events/${event.id}/edit`}>
            Edit
          </a>
        </div>
      </div>
    </div>
  )
}

export default EventPanelItem
