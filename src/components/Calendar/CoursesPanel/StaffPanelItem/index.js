import React from 'react'
import classnames from 'classnames'
import styles from './StaffPanelItem.scss'
import personIcon from '../../../../assets/images/person.png'

const StaffPanelItem = ({ event, date, staffId }) => {
  const { all_day, notes } = event
  const isSelected = parseInt(staffId) === event.id

  return (
    <div className={styles.eventsPanelItem}>
      <div
        className={classnames(
          styles.heading,
          isSelected && styles.headingSelected
        )}>
        <div className={styles.title} style={{ background: event.colour }}>
          <div className={styles.top}>
            <div className={styles.body}>
              <img src={personIcon} alt="" className={styles.instructorIcon} />{' '}
              <div className={styles.name}>{event.instructor_name}</div>
              <span className={styles.pipe}>|</span>
              <span className={styles.time}>
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
            <a
              className={styles.editLink}
              href={`/calendar/${date}/staff/${event.instructor}/${event.id}/edit`}>
              Edit
            </a>
          </div>
          {notes && <div className={styles.notes}>{notes}</div>}
        </div>
      </div>
    </div>
  )
}

export default StaffPanelItem
