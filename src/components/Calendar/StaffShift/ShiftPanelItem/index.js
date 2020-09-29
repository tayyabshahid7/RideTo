import React from 'react'
import styles from './ShiftPanelItem.scss'
import UserInitial from '../../UserInitial'
import CalendarShiftIcon from '../../CalendarShiftIcon'
import { Link } from 'react-router-dom'
import { SHIFT_TYPES } from '../../../../common/constants'

const ShiftPanelItem = ({ diary, schools, instructors, date, canEdit }) => {
  const instructor = instructors.find(x => x.id === diary.instructor_id)

  let type = SHIFT_TYPES.find(x => x.id === diary.event_type)
  if (!type) {
    type = SHIFT_TYPES[0]
  }

  const school = schools.find(x => x.id === diary.supplier_id)
  const schoolName = school ? school.name : ''

  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <div className={styles.user}>
          {canEdit ? (
            <Link
              to={`/calendar/${date}/shifts/${diary.instructor_id}/${diary.id}/edit`}>
              <UserInitial wide noPadding user={instructor} />
            </Link>
          ) : (
            <UserInitial wide noPadding user={instructor} />
          )}
          {!!schoolName && (
            <div className={styles.line}>
              <span className={styles.notes}>{schoolName}</span>
            </div>
          )}
        </div>
        <CalendarShiftIcon diary={diary} simple />
      </div>
    </div>
  )
}

export default ShiftPanelItem
