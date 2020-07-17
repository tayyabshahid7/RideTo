import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'
import styles from './index.scss'

const CalendarFilter = ({
  users,
  inactiveUsers,
  toggleUser,
  options,
  changeSchool,
  selected
}) => {
  const handleStaffChange = userId => () => {
    toggleUser([userId], inactiveUsers.includes(userId))
  }

  const handleAllStaffChange = () => {
    const active = users.length === inactiveUsers.length
    const userIds = users.map(x => x.id)
    toggleUser(userIds, active)
  }

  const handleSupplierChange = option => () => {
    if (selected !== option.id) {
      changeSchool(option.id, option.name)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Location</h5>
        </div>
        {options.map(opt => (
          <div className={styles.sectionItem}>
            <h6 className={styles.sectionLabel}>{opt.name}</h6>
            <label className="switch">
              <input
                type="checkbox"
                checked={opt.id === selected}
                onChange={handleSupplierChange(opt)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
        <div className={styles.divider}></div>

        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Staff</h5>
          <label className="switch">
            <input
              type="checkbox"
              checked={inactiveUsers.length !== users.length}
              onChange={handleAllStaffChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        {users.map(user => (
          <div className={styles.sectionItem} key={user.id}>
            <h6 className={styles.sectionLabel}>
              {user.first_name} {user.last_name}
            </h6>
            <label className="switch">
              <input
                type="checkbox"
                checked={!inactiveUsers.includes(user.id)}
                onChange={handleStaffChange(user.id)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}

        <div className={styles.divider}></div>

        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Course</h5>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    options: state.auth.user.suppliers,
    selected: state.auth.schoolId
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarFilter)
