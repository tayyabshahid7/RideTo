import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import CourseSummary from '../CoursesPanel/CourseSummary'
import EditOrderFormContainer from 'pages/Calendar/EditOrderFormContainer'
import CoursePackageForm from './CoursePackages/CoursePackageForm'
import { ConnectInput } from 'components/ConnectForm'
import { updatePackage } from 'services/course'

import {
  deleteOrderTraining,
  updateCourse,
  addCoursePackage,
  editCoursePackage,
  getSchoolOrder,
  getDayCourses,
  updateOrder
} from 'store/course'

const EditOrderComponent = ({
  history,
  orderDetail,
  orderIndex,
  schools,
  instructors,
  saving,
  activeSchools,

  coursePackage,
  deleteOrderTraining,
  updateCourse,
  addCoursePackage,
  editCoursePackage,
  getSchoolOrder,
  getDayCourses,
  updateOrder,
  loadCourses
}) => {
  const [submitted] = useState(false)

  let { order, isPackage, price, courses } = orderDetail
  console.log('*** order detail', orderDetail)

  useEffect(() => {
    if (orderIndex === -1 || !courses.length) {
      history.push('/calendar')
    } else {
      const tmp = courses[0].orders[orderIndex]
      getSchoolOrder(tmp.id)
    }
  }, [])

  useEffect(() => {
    if (submitted && !saving) {
      history.push(`/calendar/${courses[0].date}`)
    }
  }, [saving])

  const course = courses[0]

  if (!courses.length) {
    return null
  }

  if (!order && course.orders && orderIndex !== -1) {
    order = course.orders[orderIndex]
  }

  if (!order) {
    return null
  }

  const isFullLicense = courses[0].course_type.constant.includes('FULL_LICENCE')

  const handleAddPackage = () => {
    addCoursePackage()
  }

  const handleEditPackage = () => {
    editCoursePackage()
  }

  const handleCancel = () => {
    history.push(`/calendar/${courses[0].date}`)
  }

  const handleUpdateOrder = async (updatedOrder, updateDate = false) => {
    // const courseIds = courses.map(x => x.id).join(',')
    if (updatedOrder.user_first_name && updatedOrder.user_last_name) {
      updatedOrder.user_name = `${updatedOrder.user_first_name} ${updatedOrder.user_last_name}`
    }
    if (!updateDate) {
      // order.school_course = courseIds
    }

    if (!updatedOrder.user_birthdate) {
      delete updatedOrder['user_birthdate']
    }

    await updateOrder({
      trainingId: order.id,
      order: {
        ...updatedOrder,
        full_edit: updateDate
      }
    })

    // await this.props.updateCourse({
    //   schoolId: order.training_location,
    //   courseId: courseId,
    //   data: { spaces: courseSpaces }
    // })

    if (updateDate) {
      getDayCourses({ activeSchools, date: course.date })
      loadCourses(true)
    }

    console.log('*** course', orderDetail)
    if (orderDetail.isPackage) {
      const courseIds = courses.map(x => x.id.toString())
      await updatePackage(
        orderDetail.order.package,
        courseIds,
        orderDetail.price * 100
      )
    }

    handleCancel()
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

  if (coursePackage && coursePackage.adding) {
    return (
      <CoursePackageForm
        date={courses[0].date}
        courses={coursePackage.courses}
      />
    )
  }

  return (
    <div>
      <DateHeading
        title={order.customer_name || order.customer.full_name}
        subtitle={order.direct_friendly_id || order.order.direct_friendly_id}
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
      {isFullLicense && isPackage && (
        <ConnectInput
          basic
          className={styles.inputNumber}
          name="price"
          label="Total Package Cost"
          value={price}
          type="number"
          min="0"
          prefix="£"
          raw
          disabled
        />
      )}
      {isFullLicense && (
        <div className={styles.buttonHolder}>
          {isPackage ? (
            <div className={styles.addButton} onClick={handleEditPackage}>
              Edit Package
            </div>
          ) : (
            <div className={styles.addButton} onClick={handleAddPackage}>
              Create a Package
            </div>
          )}
        </div>
      )}
      <EditOrderFormContainer
        onCancel={handleCancel}
        course_type={courses[0].course_type.constant}
        date={course.date}
        time={course.time}
        onDelete={handleDeleteTraining}
        onSave={handleUpdateOrder}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const schools = state.auth.user ? state.auth.user.suppliers : []
  return {
    orderDetail: state.course.order,
    orderIndex: state.course.order.orderIndex,
    schools,
    instructors: state.instructor.instructors,
    info: state.info,
    saving: state.course.single.saving,
    coursePackage: state.course.coursePackage,
    activeSchools: state.auth.activeSchools
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCourse,
      deleteOrderTraining,
      addCoursePackage,
      editCoursePackage,
      getDayCourses,
      updateOrder,
      getSchoolOrder
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrderComponent)
