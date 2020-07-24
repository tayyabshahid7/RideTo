import React, { useEffect, useRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool, updateActiveSchool } from 'store/auth'
import { loadCourseTypes } from 'store/info'
import styles from './index.scss'
import { Mobile } from 'common/breakpoints'
import CalendarViewChanger from '../CalendarViewChanger'
import Logo from 'components/common/Logo'
import CloseButton from 'components/common/CloseButton'
import classnames from 'classnames'

const CalendarFilter = ({
  users,
  inactiveUsers,
  inactiveCourses,
  toggleUser,
  toggleCourse,
  suppliers,
  schoolId,
  activeSchools,
  loadCourseTypes,
  info,
  hideFilter,
  handleCustomEvent,
  updateActiveSchool,
  calendar
}) => {
  const inputEl = useRef(null)
  useEffect(() => {
    loadCourseTypes({ schoolId })
  }, [schoolId])

  useEffect(() => {
    const handleClickOutside = event => {
      if (inputEl && !inputEl.current.contains(event.target)) {
        hideFilter()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleStaffChange = userId => () => {
    toggleUser([userId], inactiveUsers.includes(userId))
  }

  const handleCourseChange = courseId => () => {
    toggleCourse([courseId], inactiveCourses.includes(courseId))
  }

  const handleAllStaffChange = () => {
    const active = users.length === inactiveUsers.length - 1
    const userIds = users.map(x => x.id)
    toggleUser([...userIds, -1], active)
  }

  const handleSchoolChange = school => () => {
    let schoolIds = [...activeSchools]
    if (activeSchools.includes(school.id)) {
      schoolIds = schoolIds.filter(x => x !== school.id)
    } else {
      schoolIds.push(school.id)
    }
    updateActiveSchool(schoolIds)
  }

  const { viewMode } = calendar

  const courseTypes = info.courseTypes.filter(
    x => x.constant !== 'FULL_LICENCE'
  )

  return (
    <div className={styles.wrapper} ref={inputEl}>
      <div className={styles.container}>
        <Mobile>
          <div className={styles.mobileHeader}>
            <Logo />
            <CloseButton handleClick={hideFilter} />
          </div>
          <CalendarViewChanger
            viewMode={viewMode}
            handleCustomEvent={handleCustomEvent}
          />
          <div
            className={classnames(styles.divider, styles.dividerNormal)}></div>
        </Mobile>
        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Location</h5>
        </div>
        {suppliers.map(school => (
          <div className={styles.sectionItem} key={school.id}>
            <h6 className={styles.sectionLabel}>{school.name}</h6>
            <label className="switch">
              <input
                type="checkbox"
                checked={activeSchools.includes(school.id)}
                onChange={handleSchoolChange(school)}
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
    suppliers: state.auth.user.suppliers,
    schoolId: state.auth.schoolId,
    activeSchools: state.auth.activeSchools,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool,
      updateActiveSchool,
      loadCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarFilter)
