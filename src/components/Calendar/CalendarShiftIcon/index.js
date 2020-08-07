import React from 'react'
import styles from './index.scss'
import { SHIFT_TYPES } from 'common/constants'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../assets/icons'

const CalendarShiftIcon = ({ diary }) => {
  let type = SHIFT_TYPES.find(x => x.id === diary.event_type)
  if (!type) {
    type = SHIFT_TYPES[0]
  }

  return (
    <div className={styles.container}>
      {type.id ? (
        'EVENT_SHIFT' && (
          <React.Fragment>
            {diary.times.map(time => (
              <div key={time.id} className={styles.diaryItem}>
                <IconClock />
                <span className={styles.diaryText}>
                  {time.start_time.substr(0, 5)} - {time.end_time.substr(0, 5)}
                </span>
              </div>
            ))}
          </React.Fragment>
        )
      ) : (
        <React.Fragment>
          <div className={styles.diaryItem}>
            {type.id === 'EVENT_BLOCKER' && <IconBlocker />}
            {type.id === 'EVENT_SICK_DAY' && <IconSick />}
            {type.id === 'EVENT_HOLIDAY' && <IconHoliday />}
            <span className={styles.diaryText}>{type.name}</span>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default CalendarShiftIcon
