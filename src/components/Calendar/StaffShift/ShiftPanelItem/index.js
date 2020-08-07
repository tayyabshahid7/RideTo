import React from 'react'
import styles from './ShiftPanelItem.scss'
import UserInitial from '../../UserInitial'
import CalendarShiftIcon from '../../CalendarShiftIcon'
import { Link } from 'react-router-dom'
import { SHIFT_TYPES } from '../../../../common/constants'

const ShiftPanelItem = ({ diary, date }) => {
  diary.first_name = diary.instructor_name
    ? diary.instructor_name.split(' ')[0]
    : ''
  diary.last_name = diary.instructor_name
    ? diary.instructor_name.split(' ')[1]
    : ''
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
            <UserInitial user={diary} />
          </Link>
        </div>
        <CalendarShiftIcon diary={diary} />
      </div>
    </div>
  )
}

export default ShiftPanelItem
