import React from 'react'
import classnames from 'classnames'
import styles from './EventPanelItem.scss'
import { getTimeFromDateTime } from 'utils/helper'
import { Link } from 'react-router-dom'

const EventPanelItem = ({ event, date, eventId }) => {
  const { notes = '', all_day } = event
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
              {all_day ? (
                'ALL DAY'
              ) : (
                <React.Fragment>
                  {getTimeFromDateTime(event.start_time)} -{' '}
                  {getTimeFromDateTime(event.end_time)}
                </React.Fragment>
              )}
            </div>
            <div className={styles.name}>{event.name}</div>
            {notes && <div className={styles.notes}>{truncated}</div>}
          </div>
          <Link
            className={styles.editLink}
            to={`/calendar/${date}/events/${event.id}/edit`}>
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventPanelItem
