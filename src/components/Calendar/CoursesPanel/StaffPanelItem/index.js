import React from 'react'
import classnames from 'classnames'
import styles from './StaffPanelItem.scss'
import UserInitial from '../../UserInitial'

const StaffPanelItem = ({ event, date, staffId }) => {
  const { all_day, notes } = event
  const isSelected = parseInt(staffId) === event.id

  event.first_name = event.instructor_name.split(' ')[0]
  event.last_name = event.instructor_name.split(' ')[1]

  return (
    <div className={styles.container} style={{ background: event.colour }}>
      <div className={styles.line}>
        <div className={styles.user}>
          <UserInitial user={event} />
        </div>
        <span className={styles.notes}>
          {all_day ? (
            'All day'
          ) : (
            <React.Fragment>
              {event.start_time.substring(0, 5)} -{' '}
              {event.end_time.substring(0, 5)}
            </React.Fragment>
          )}
        </span>
      </div>
      <div className={styles.line}>
        <div>{notes && <span className={styles.notes}>{notes}</span>}</div>
        <a
          className={styles.editLink}
          href={`/calendar/${date}/staff/${event.instructor}/${event.id}/edit`}>
          Edit
        </a>
      </div>
    </div>
  )
}

export default StaffPanelItem
