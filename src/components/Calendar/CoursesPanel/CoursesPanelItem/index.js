import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import { getShortCourseType } from 'services/course'
import OrdersPanel from 'components/Calendar/OrdersPanel'
import {
  createSchoolOrder,
  createSchoolPayment,
  updateSchoolOrder,
  deleteOrderTraining,
  updateCourse
} from 'store/course'
import { TEST_STATUS_CHOICES } from 'common/constants'
import { mapLabelColoursWithContant } from 'services/settings'
import styles from './CoursesPanelItem.scss'
import personIcon from '../../../../assets/images/person.png'
import { getCourseSpaceTextShort } from 'services/course'

const CoursesPanelItem = ({
  course,
  date,
  loading,
  saving,
  schoolId,
  info,
  createSchoolOrder,
  createSchoolPayment,
  updateSchoolOrder,
  deleteOrderTraining,
  updateCourse,
  updateAdding,
  addingOrder,
  courseId,
  settings,
  canEdit,
  loadCourses
}) => {
  const name = getShortCourseType(course.course_type)
  const availableSpaces = course.spaces - course.orders.length
  const className = classnames(styles.course)
  const isTestCourse =
    course.course_type.constant.includes('FULL_LICENCE') &&
    course.course_type.constant.includes('TEST')
  const { notes = '', instructor } = course
  const truncated = notes.length > 200 ? `${notes}...` : notes
  const isSelected = parseInt(courseId) === course.id

  return (
    <div className={styles.coursesPanelItem}>
      <div
        className={classnames(
          styles.heading,
          isSelected && styles.headingSelected
        )}>
        <div
          className={classnames(styles.container, className)}
          style={{
            background: mapLabelColoursWithContant(
              settings,
              course.course_type.constant
            )
          }}>
          <div className={styles.top}>
            <div className={styles.title}>
              <div>
                <span className={styles.name}>{name}</span> |{' '}
                {course.time.substring(0, 5)} -{' '}
                {moment(`${course.date} ${course.time}`)
                  .add(course.duration / 60, 'hours')
                  .format('HH:mm')}
                {isTestCourse &&
                  course.application_reference_number &&
                  `(${course.application_reference_number})`}
              </div>
              {isTestCourse && (
                <div className={styles.testNotes}>
                  <b>{TEST_STATUS_CHOICES[course.status]}</b>
                  <br />
                  {course.test_centre_name}
                  <br />
                  Last day to cancel:{' '}
                  {moment(course.last_date_cancel).format('Do MMM YYYY')}
                </div>
              )}
            </div>
            {canEdit && (
              <Link
                className={styles.editButton}
                to={`/calendar/${date}/courses/${course.id}/edit`}>
                Edit
              </Link>
            )}
          </div>
          <div className={styles.instAndSpaces}>
            {instructor && (
              <div className={styles.inst}>
                <img
                  className={styles.personIcon}
                  src={personIcon}
                  alt="Instructor:"
                  width="12"
                  height="12"
                />{' '}
                {instructor.first_name} {instructor.last_name}
              </div>
            )}
            <span
              className={classnames(
                styles.eventSpaces,
                availableSpaces === 2 && styles.textMildWarning,
                availableSpaces === 1 && styles.textWarning,
                availableSpaces === 0 && styles.textDanger
              )}>
              {getCourseSpaceTextShort(course)}
            </span>
          </div>
          {notes && <div className={styles.notes}>{truncated}</div>}
        </div>
      </div>

      <OrdersPanel
        course={course}
        info={info}
        createSchoolOrder={createSchoolOrder}
        createSchoolPayment={createSchoolPayment}
        updateSchoolOrder={updateSchoolOrder}
        deleteOrderTraining={deleteOrderTraining}
        updateCourse={updateCourse}
        loading={loading}
        schoolId={schoolId}
        saving={saving}
        addingOrder={addingOrder}
        updateAdding={updateAdding}
        loadCourses={loadCourses}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    loading: state.course.single.loading,
    saving: state.course.single.saving,
    info: state.info,
    settings: state.settings.settings
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCourse,
      createSchoolOrder,
      createSchoolPayment,
      updateSchoolOrder,
      deleteOrderTraining
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanelItem)
