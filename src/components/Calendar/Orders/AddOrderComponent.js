import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import CourseSummary from '../CoursesPanel/CourseSummary'
import AddOrderForm from './AddOrderForm'
import {
  createSchoolOrder,
  createSchoolPayment
  // updateSchoolOrder,
  // deleteOrderTraining,
  // updateCourse,
  // setOrderCourse
} from 'store/course'
import { BIKE_HIRE } from 'common/constants'

const AddOrderComponent = ({
  history,
  courses,
  schools,
  info,
  instructors,
  saving,
  createSchoolOrder,
  createSchoolPayment
}) => {
  const [submitted, setSubmitted] = useState(false)

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

  console.log(courses)

  if (!courses.length) {
    return null
  }

  const isFullLicense = courses[0].course_type.constant.includes('FULL_LICENCE')

  const handlePackage = () => {}

  const handleNewOrder = order => {
    const course = courses[0]

    if (!order.full_licence_type) {
      if (order.bike_hire === BIKE_HIRE.MANUAL) {
        let manualOrdersCount = course.orders.filter(
          order1 => order1.bike_hire === BIKE_HIRE.MANUAL
        ).length
        if (course.manual_bikes - manualOrdersCount <= 0) {
          alert('There aren’t enough manual bikes available in the course')
          return
        }
      } else if (order.bike_hire === BIKE_HIRE.AUTO) {
        let automaticOrdersCount = course.orders.filter(
          order1 => order1.bike_hire === BIKE_HIRE.AUTO
        ).length
        if (course.auto_bikes - automaticOrdersCount <= 0) {
          alert('There aren’t enough automatic bikes available in the course')
          return
        }
      }
    } else {
      // TODO Front end full licence validation
      // const { bike_hire, full_licence_type } = order
      // const maxOrders = parseInt(
      //   course[`${full_licence_type.toLowerCase()}_${bike_hire}_bikes`],
      //   10
      // )
      // const sameCourseOrderCount = course.orders.filter(
      //   courseOrder =>
      //     courseOrder.bike_hire === bike_hire &&
      //     courseOrder.full_licence_type === full_licence_type
      // ).length
      // if (maxOrders - sameCourseOrderCount <= 0) {
      //   alert(`${full_licence_type} ${bike_hire} bike not available`)
      // }
    }

    setSubmitted(true)
    return createSchoolOrder({ schoolId: course.supplier, order })
  }

  const handleCancel = () => {
    history.push(`/calendar/${courses[0].date}`)
  }

  const handleNewPayment = (order, token, price, email) => {
    const schoolId = courses[0].supplier

    return createSchoolPayment(schoolId, {
      order_id: order.order_id,
      token: token.id,
      expected_price: price,
      email
    })
  }

  return (
    <div>
      <DateHeading title="Add Order" backLink={`/calendar`} />
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
      <AddOrderForm
        info={info}
        course={courses[0]}
        onCancel={handleCancel}
        onSave={handleNewOrder}
        onPayment={handleNewPayment}
        saving={saving}
      />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const schools = state.auth.user ? state.auth.user.suppliers : []
  return {
    courses: state.course.order.courses,
    schools,
    instructors: state.instructor.instructors,
    info: state.info,
    saving: state.course.single.saving
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createSchoolPayment,
      createSchoolOrder
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOrderComponent)
