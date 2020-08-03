import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarShiftDayCellItem.scss'
import UserInitial from '../UserInitial'
import classnames from 'classnames'
import { SHIFT_TYPES } from '../../../common/constants'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../assets/icons'

const CalendarShiftDayCellItem = ({ item, schools, normal }) => {
  const type = SHIFT_TYPES.find(x => x.id === item.event_type)
  if (!type) {
    return null
  }

  const school = schools.find(x => x.id === item.supplier)

  const handleClick = e => {
    e.stopPropagation()
  }

  return (
    <div
      className={classnames(styles.container, normal && styles.normal)}
      style={{ backgroundColor: item.color }}
      onClick={handleClick}>
      <div className={styles.outerWrapper}>
        {normal && <UserInitial user={item} short />}
        <div className={styles.content}>
          {type.id === 'EVENT_SHIFT' && <IconClock />}
          {type.id === 'EVENT_BLOCKER' && <IconBlocker />}
          {type.id === 'EVENT_SICK_DAY' && <IconSick />}
          {type.id === 'EVENT_HOLIDAY' && <IconHoliday />}
          <span className={styles.typeText}>
            {type.id === 'EVENT_SHIFT' ? item.time : type.name}
          </span>
        </div>
      </div>
      {!!school && !normal && (
        <span className={styles.schoolName}>{school.name}</span>
      )}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers
  }
}

export default connect(mapStateToProps)(CalendarShiftDayCellItem)
