import React, { useState } from 'react'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import OrdersPanel from 'components/Calendar/OrdersPanel'
import CourseSummary from '../CourseSummary'
import {
  createSchoolOrder,
  createSchoolPayment,
  updateSchoolOrder,
  deleteOrderTraining,
  updateCourse
} from 'store/course'
import { TEST_STATUS_CHOICES } from 'common/constants'
import styles from './CoursesPanelItem.scss'
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
  handleAddPackage,
  addingOrder,
  courseId,
  schools,
  instructors,
  canEdit,
  loadCourses
}) => {
  const [showDetail, setShowDetail] = useState(false)
  const availableSpaces = course.spaces - course.orders.length
  const className = classnames(
    styles.course,
    availableSpaces === 1 && styles.warning,
    availableSpaces <= 0 && styles.danger
  )
  const isFullLicense = course.course_type.constant.includes('FULL_LICENCE')
  const isTestCourse =
    isFullLicense && course.course_type.constant.includes('TEST')
  let { instructor } = course
  if (instructor) {
    instructor = instructors.find(x => x.id === instructor.id)
  }
  const isSelected = parseInt(courseId) === course.id

  const handlePackage = () => {
    handleAddPackage(course)
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={classnames(
          styles.heading,
          isSelected && styles.headingSelected
        )}>
        <div className={classnames(styles.container, className)}>
          <CourseSummary
            course={course}
            date={date}
            addingOrder={addingOrder}
            courseId={courseId}
            schools={schools}
            instructors={instructors}
            canEdit={canEdit}
          />
          {!addingOrder && (
            <React.Fragment>
              <div className={styles.line}>
                <span>{getCourseSpaceTextShort(course)}</span>
              </div>
              {/* <div className={styles.line}>
                {notes && <div className={styles.notes}>{truncated}</div>}
              </div> */}

              {isTestCourse && (
                <div className={styles.testNotes}>
                  {showDetail && (
                    <React.Fragment>
                      <div className={styles.line}>
                        {TEST_STATUS_CHOICES[course.status]}
                      </div>
                      {course.test_centre_name && (
                        <div className={styles.line}>
                          {course.test_centre_name}
                        </div>
                      )}
                      {isTestCourse && course.application_reference_number && (
                        <div className={styles.line}>
                          {`${course.application_reference_number}`}
                        </div>
                      )}
                      <div className={styles.line}>
                        Cancel by:{' '}
                        {moment(course.last_date_cancel).format('Do MMM YYYY')}
                      </div>
                    </React.Fragment>
                  )}
                  <div
                    className={classnames(
                      styles.detail,
                      showDetail && styles.isOpen
                    )}
                    onClick={() => setShowDetail(!showDetail)}>
                    <i className="fa fa-angle-down"></i>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {addingOrder && isFullLicense && (
        <div className={styles.buttonHolder}>
          <div className={styles.addButton} onClick={handlePackage}>
            Create a Package
          </div>
        </div>
      )}

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
  const schools = state.auth.user ? state.auth.user.suppliers : []
  return {
    schoolId: state.auth.schoolId,
    schools,
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
