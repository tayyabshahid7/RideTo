import React from 'react'
import styles from './index.scss'
import { SHIFT_TYPES } from 'common/constants'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../assets/icons'

const CalendarShiftIcon = ({ staff }) => {
  const type = SHIFT_TYPES.find(x => x.id === staff.event_type)
  if (!type) {
    return null
  }

  return (
    <div className={styles.container}>
      {type.id === 'EVENT_SHIFT' && <IconClock />}
      {type.id === 'EVENT_BLOCKER' && <IconBlocker />}
      {type.id === 'EVENT_SICK_DAY' && <IconSick />}
      {type.id === 'EVENT_HOLIDAY' && <IconHoliday />}
      <span className={styles.typeText}>
        {type.id === 'EVENT_SHIFT' ? staff.time : type.name}
      </span>
    </div>
  )
}

export default CalendarShiftIcon
