import React from 'react'
import styles from './ShiftPanelItem.scss'
import UserInitial from '../../UserInitial'
import { Link } from 'react-router-dom'
import { SHIFT_TYPES } from '../../../../common/constants'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../../assets/icons'

const ShiftPanelItem = ({ staff, date }) => {
  // const { all_day } = staff
  // const isSelected = parseInt(staffId) === staff.id

  staff.first_name = staff.instructor_name.split(' ')[0]
  staff.last_name = staff.instructor_name.split(' ')[1]
  const type = SHIFT_TYPES.find(x => x.id === staff.event_type)
  if (!type) {
    return null
  }

  return (
    <div className={styles.container} style={{ background: staff.colour }}>
      <div className={styles.line}>
        <div className={styles.user}>
          <Link
            to={`/calendar/${date}/shifts/${staff.instructor}/${staff.id}/edit`}>
            <UserInitial user={staff} />
          </Link>
        </div>
        <div className={styles.detail}>
          {type.id === 'EVENT_SHIFT' && <IconClock />}
          {type.id === 'EVENT_BLOCKER' && <IconBlocker />}
          {type.id === 'EVENT_SICK_DAY' && <IconSick />}
          {type.id === 'EVENT_HOLIDAY' && <IconHoliday />}
          <span className={styles.typeText}>
            {type.id === 'EVENT_SHIFT' ? (
              <React.Fragment>
                {staff.start_time.substring(0, 5)} -{' '}
                {staff.end_time.substring(0, 5)}
              </React.Fragment>
            ) : (
              type.name
            )}
          </span>
        </div>
      </div>
      {/* <div>{notes && <span className={styles.notes}>{notes}</span>}</div> */}
    </div>
  )
}

export default ShiftPanelItem
