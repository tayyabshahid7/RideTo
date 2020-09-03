import React, { useEffect, useRef } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool, updateActiveSchool } from 'store/auth'
import styles from './index.scss'
import { Mobile } from 'common/breakpoints'
import CalendarViewChanger from '../CalendarViewChanger'
import { CALENDAR_VIEW } from '../../../common/constants'
import Logo from 'components/common/Logo'
import CloseButton from 'components/common/CloseButton'
import classnames from 'classnames'

const CalendarFilter = ({
  users: currUsers,
  inactiveUsers,
  inactiveCourses,
  toggleUser,
  toggleCourse,
  suppliers,
  activeSchools,
  info,
  hideFilter,
  handleCustomEvent,
  updateActiveSchool,
  calendar
}) => {
  const shiftView = calendar.viewMode === CALENDAR_VIEW.SHIFT
  const inputEl = useRef(null)
  // const currUsers = users.filter(
  //   x => shiftView || _.intersection(x.supplier, activeSchools).length
  // )

  const courseTypes = info.courseTypes.filter(
    x => x.constant !== 'FULL_LICENCE'
  )

  // useEffect(() => {
  //   // update users list
  //   const currUserIds = currUsers.map(x => x.id)
  //   const userIds = _.intersection(inactiveUsers, [...currUserIds, -1])
  //   toggleUser(userIds)

  //   // update course list
  //   const currCourseIds = courseTypes.map(x => x.id)
  //   const courseIds = _.intersection(inactiveCourses, currCourseIds)
  //   toggleCourse(courseIds)
  // }, [activeSchools])

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        inputEl &&
        event.target.id !== 'btn-filter-toggle' &&
        !inputEl.current.contains(event.target)
      ) {
        hideFilter()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleStaffChange = userId => () => {
    let userIds = []
    if (inactiveUsers.includes(userId)) {
      userIds = inactiveUsers.filter(x => x !== userId)
    } else {
      userIds = [...inactiveUsers, userId]
    }
    toggleUser(userIds)
  }

  const handleCourseChange = courseId => () => {
    let courseIds = []
    if (inactiveCourses.includes(courseId)) {
      courseIds = inactiveCourses.filter(x => x !== courseId)
    } else {
      courseIds = [...inactiveCourses, courseId]
    }
    toggleCourse(courseIds)
  }

  const handleAllStaffChange = () => {
    const active = currUsers.length === inactiveUsers.length - 1
    let userIds = []
    if (active) {
      userIds = []
    } else {
      userIds = currUsers.map(x => x.id)
      userIds.push(-1)
    }
    toggleUser(userIds)
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

  return (
    <div className={styles.wrapper} ref={inputEl}>
      <div className={styles.container}>
        <Mobile>
          <div className={styles.mobileHeader}>
            <Logo />
            <CloseButton onClick={hideFilter} />
          </div>
          <CalendarViewChanger
            viewMode={viewMode}
            handleCustomEvent={handleCustomEvent}
          />
          <div
            className={classnames(styles.divider, styles.dividerNormal)}></div>
        </Mobile>
        {!shiftView && (
          <React.Fragment>
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
          </React.Fragment>
        )}

        <div className={styles.sectionItem}>
          <h5 className={styles.sectionTitle}>Staff</h5>
          <label className="switch">
            <input
              type="checkbox"
              checked={inactiveUsers.length !== currUsers.length + 1}
              onChange={handleAllStaffChange}
            />
            <span className="slider round"></span>
          </label>
        </div>
        {currUsers.map(user => (
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
        {!shiftView && (
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
        )}
        <div className={styles.divider}></div>

        {!shiftView && (
          <React.Fragment>
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
          </React.Fragment>
        )}
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
      updateActiveSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarFilter)
