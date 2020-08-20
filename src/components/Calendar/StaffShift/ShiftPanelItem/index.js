import React from 'react'
import styles from './ShiftPanelItem.scss'
import UserInitial from '../../UserInitial'
import CalendarShiftIcon from '../../CalendarShiftIcon'
import { Link } from 'react-router-dom'
import { SHIFT_TYPES } from '../../../../common/constants'

const ShiftPanelItem = ({ diary, instructors, date }) => {
  const instructor = instructors.find(x => x.id === diary.instructor_id)

  let type = SHIFT_TYPES.find(x => x.id === diary.event_type)
  if (!type) {
    type = SHIFT_TYPES[0]
  }

  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <div className={styles.user}>
          <Link
            to={`/calendar/${date}/shifts/${diary.instructor_id}/${diary.id}/edit`}>
            <UserInitial user={instructor} />
          </Link>
        </div>
        <CalendarShiftIcon diary={diary} />
      </div>
    </div>
  )
}

export default ShiftPanelItem
