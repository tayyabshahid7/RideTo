import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarShiftDayCellItem.scss'
import { SHIFT_TYPES } from '../../../common/constants'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../assets/icons'

const CalendarShiftDayCellItem = ({ item, schools }) => {
  const type = SHIFT_TYPES.find(x => x.id === item.event_type)
  if (!type) {
    return null
  }

  const school = schools.find(x => x.id === item.supplier)

  const handleClick = e => {
    e.stopPropagation()
    console.log(item)
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.content}>
        {type.id === 'EVENT_SHIFT' && <IconClock />}
        {type.id === 'EVENT_BLOCKER' && <IconBlocker />}
        {type.id === 'EVENT_SICK_DAY' && <IconSick />}
        {type.id === 'EVENT_HOLIDAY' && <IconHoliday />}
        <span className={styles.typeText}>
          {type.id === 'EVENT_SHIFT' ? item.time : type.name}
        </span>
      </div>
      {!!school && <span className={styles.schoolName}>{school.name}</span>}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers
  }
}

export default connect(mapStateToProps)(CalendarShiftDayCellItem)
