import React from 'react'
import { connect } from 'react-redux'
import styles from './CalendarShiftDayCellItem.scss'
import UserInitial from '../UserInitial'
import CalendarShiftIcon from '../CalendarShiftIcon'
import classnames from 'classnames'
import { SHIFT_TYPES } from '../../../common/constants'

const CalendarShiftDayCellItem = ({ diary, schools, onClick, normal }) => {
  let type = SHIFT_TYPES.find(x => x.id === diary.event_type)
  if (!type) {
    type = SHIFT_TYPES[0]
  }

  const school = schools.find(x => x.id === diary.supplier_id)

  const handleClick = e => {
    e.stopPropagation()
    onClick && onClick(diary)
  }

  return (
    <div
      className={classnames(styles.container, normal && styles.normal)}
      style={{ backgroundColor: diary.color }}
      onClick={handleClick}>
      <div className={styles.outerWrapper}>
        {normal && <UserInitial user={diary} short />}
        <CalendarShiftIcon diary={diary} />
      </div>
      {diary.event_type === SHIFT_TYPES[0].id && (
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
