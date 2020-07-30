import React, { useState } from 'react'
import classnames from 'classnames'
import styles from './EventPanelItem.scss'
import { getTimeFromDateTime } from 'utils/helper'
import { Link } from 'react-router-dom'

const EventPanelItem = ({ event, date, eventId }) => {
  const [showDetail, setShowDetail] = useState(false)
  const { notes = '', all_day } = event
  const truncated = notes.length > 200 ? `${notes}...` : notes
  // const isSelected = parseInt(eventId) === event.id

  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <Link
          className={styles.editLink}
          to={`/calendar/${date}/events/${event.id}/edit`}>
          {event.name}
        </Link>
        <span>
          {all_day ? (
            'ALL DAY'
          ) : (
            <React.Fragment>
              {getTimeFromDateTime(event.start_time)} -{' '}
              {getTimeFromDateTime(event.end_time)}
            </React.Fragment>
          )}
        </span>
      </div>
      {showDetail && <div className={styles.note}>{truncated}</div>}
      {!!notes.length && (
        <div
          className={classnames(styles.detail, showDetail && styles.isOpen)}
          onClick={() => setShowDetail(!showDetail)}>
          <i className="fa fa-angle-down"></i>
        </div>
      )}
    </div>
  )
}

export default EventPanelItem
