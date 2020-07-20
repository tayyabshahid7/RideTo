import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'
import { loadCourseTypes } from 'store/info'
import styles from './index.scss'

const CalendarFilter = ({
  users,
  inactiveUsers,
  inactiveCourses,
  toggleUser,
  toggleCourse,
  options,
  changeSchool,
  schoolId,
  loadCourseTypes,
  info
}) => {
  useEffect(() => {
    loadCourseTypes({ schoolId })
  }, [schoolId])

  const handleStaffChange = userId => () => {
    toggleUser([userId], inactiveUsers.includes(userId))
  }

  const handleCourseChange = courseId => () => {
    toggleCourse([courseId], inactiveCourses.includes(courseId))
  }

  const handleAllStaffChange = () => {
    const active = users.length === inactiveUsers.length
    const userIds = users.map(x => x.id)
    toggleUser(userIds, active)
  }

  const handleSupplierChange = option => () => {
    if (schoolId !== option.id) {
      changeSchool(option.id, option.name)
    }
  }

  const courseTypes = info.courseTypes.filter(
    x => x.constant !== 'FULL_LICENCE'
  )

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
                checked={opt.id === schoolId}
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
              checked={inactiveUsers.length !== users.length + 1}
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
        <div className={styles.sectionItem} key={-1}>
          <h6 className={styles.sectionLabel}>Unassigned</h6>
          <label className="switch">
            <input
              type="checkbox"
              checked={!inactiveUsers.includes(-1)}
              onChange={handleStaffChange(-1)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Course</h5>
        </div>
        {courseTypes.map(course => (
          <div className={styles.sectionItem} key={course.id}>
            <h6 className={styles.sectionLabel}>{course.name}</h6>
            <label className="switch">
              <input
                type="checkbox"
                checked={!inactiveCourses.includes(course.id)}
                onChange={handleCourseChange(course.id)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    options: state.auth.user.suppliers,
    schoolId: state.auth.schoolId,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool,
      loadCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarFilter)
