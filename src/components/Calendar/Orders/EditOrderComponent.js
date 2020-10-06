import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import CourseSummary from '../CoursesPanel/CourseSummary'
import EditOrderFormContainer from 'pages/Calendar/EditOrderFormContainer'

import {
  updateSchoolOrder,
  deleteOrderTraining,
  updateCourse
  // setOrderCourse
} from 'store/course'

const EditOrderComponent = ({
  history,
  courses,
  orderIndex,
  schools,
  info,
  instructors,
  saving,
  loadCourses,
  updateSchoolOrder,
  updateCourse,
  deleteOrderTraining
}) => {
  const [submitted] = useState(false)

  useEffect(() => {
    if (!courses.length) {
      history.push('/calendar')
    }
  }, [])

  useEffect(() => {
    if (submitted && !saving) {
      history.push(`/calendar/${courses[0].date}`)
    }
  }, [saving])

  console.log(courses, orderIndex)

  if (!courses.length) {
    return null
  }

  const course = courses[0]
  const order = course.orders[orderIndex]
  console.log(order)

  const isFullLicense = courses[0].course_type.constant.includes('FULL_LICENCE')

  const handlePackage = () => {}

  const handleCancel = () => {
    history.push(`/calendar/${courses[0].date}`)
  }

  const handleDeleteTraining = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the training from Order ${order.direct_friendly_id}?`
      )
    ) {
      try {
        await deleteOrderTraining(course.supplier, order.id)
        handleCancel()
      } catch {
        console.log("Couldn't delete order.")
      }
    }
  }

  return (
    <div>
      <DateHeading
        title={order.customer_name}
        subtitle={order.direct_friendly_id}
        onBack={handleCancel}
      />
      {courses.map(course => (
        <CourseSummary
          key={course.id}
          course={course}
          date={course.order}
          addingOrder={true}
          schools={schools}
          instructors={instructors}
          embedded={false}
        />
      ))}
      {isFullLicense && (
        <div className={styles.buttonHolder}>
          <div className={styles.addButton} onClick={handlePackage}>
            Create a Package
          </div>
        </div>
      )}
      <EditOrderFormContainer
        updateCourse={updateCourse}
        onCancel={handleCancel}
        trainingId={order.id}
        course_type={courses[0].course_type.constant}
        courseId={course.id}
        courseSpaces={course.spaces}
        date={course.date}
        time={course.time}
        onDelete={handleDeleteTraining}
        loadCourses={loadCourses}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const schools = state.auth.user ? state.auth.user.suppliers : []
  return {
    courses: state.course.order.courses,
    orderIndex: state.course.order.orderIndex,
    schools,
    instructors: state.instructor.instructors,
    info: state.info,
    saving: state.course.single.saving
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCourse,
      updateSchoolOrder,
      deleteOrderTraining
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrderComponent)
