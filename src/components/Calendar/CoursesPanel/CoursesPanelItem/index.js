import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Button } from 'reactstrap'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import { getShortCourseType } from 'services/course'
import OrdersPanel from 'components/Calendar/OrdersPanel'
import {
  createSchoolOrder,
  updateSchoolOrder,
  updateCourse
} from 'store/course'
import { TEST_STATUS_CHOICES } from 'common/constants'
import styles from './CoursesPanelItem.scss'

const CoursesPanelItem = ({
  course,
  date,
  loading,
  saving,
  schoolId,
  info,
  createSchoolOrder,
  updateSchoolOrder,
  updateCourse
}) => {
  const name = getShortCourseType(course.course_type)
  const availableSpaces = course.spaces - course.orders.length
  const className = classnames(
    styles.course,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger
  )
  const isTestCourse =
    course.course_type.constant.includes('FULL_LICENCE') &&
    course.course_type.constant.includes('TEST')
  const { notes = '' } = course
  const truncated = notes.length > 200 ? `${notes}...` : notes
  return (
    <div className={styles.coursesPanelItem}>
      <div className={styles.heading}>
        <div className={className}>
          <div>
            {course.time.substring(0, 5)} | {name}{' '}
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
          {notes && <div className={styles.notes}>{truncated}</div>}
        </div>
        <Button
          tag={Link}
          outline
          color="primary"
          to={`/calendar/${date}/courses/${course.id}/edit`}>
          Edit
        </Button>
      </div>

      <OrdersPanel
        course={course}
        info={info}
        createSchoolOrder={createSchoolOrder}
        updateSchoolOrder={updateSchoolOrder}
        updateCourse={updateCourse}
        loading={loading}
        schoolId={schoolId}
        saving={saving}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    loading: state.course.single.loading,
    saving: state.course.single.saving,
    info: state.info
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCourse,
      createSchoolOrder,
      updateSchoolOrder
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanelItem)
