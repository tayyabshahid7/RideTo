import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DateHeading from 'components/Calendar/DateHeading'
import CourseSummary from '../CoursesPanel/CourseSummary'
import AddOrderForm from './AddOrderForm'
import CoursePackageForm from './CoursePackages/CoursePackageForm'
import { ConnectInput } from 'components/ConnectForm'
import LoadingMask from 'components/LoadingMask'
import { fetchOrderById } from 'services/order'
import InvoiceForm from 'pages/Invoices/components/InvoiceForm'

import {
  createSchoolOrder,
  createSchoolPayment,
  addCoursePackage,
  editCoursePackage
  // updateSchoolOrder,
  // deleteOrderTraining,
  // updateCourse,
  // setOrderCourse
} from 'store/course'
import { BIKE_HIRE } from 'common/constants'

const AddOrderComponent = ({
  history,
  schools,
  orderDetail,
  info,
  instructors,
  newOrder,
  saving,
  createSchoolOrder,
  createSchoolPayment,
  addCoursePackage,
  editCoursePackage,
  coursePackage
}) => {
  const [submitted, setSubmitted] = useState(false)
  const [withInvoice, setWithInvoice] = useState(false)
  const [withPayment, setWithPayment] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const { courses, isPackage, price } = orderDetail
  const [invoiceData, setInvoiceData] = useState(null)

  useEffect(() => {
    if (!courses.length) {
      history.push('/calendar')
    }
  }, [])

  useEffect(() => {
    async function loadInvoiceData() {
      const result = await fetchOrderById(newOrder.order_id)

      const tmp = {
        customer: `${orderData.user_first_name} ${orderData.user_last_name}`,
        customerId: result.customer_id,
        supplierId: result.supplier_id,
        courseTypeId: result.course_type_id,
        order: result.direct_friendly_id,
        orderId: result.friendly_id,
        customerEmail: orderData.user_email
      }
      setInvoiceData(tmp)
    }

    if (submitted && !saving) {
      // check new order and invoice form
      if (withInvoice) {
        loadInvoiceData()
      } else {
        if (!withPayment) {
          history.push(`/calendar/${courses[0].date}`)
        }
      }
    }
  }, [saving])

  if (!courses.length) {
    return null
  }

  const isFullLicense = courses[0].course_type.constant.includes('FULL_LICENCE')

  const handleAddPackage = () => {
    addCoursePackage()
  }

  const handleEditPackage = () => {
    editCoursePackage()
  }

  const handleNewOrder = (order, invoiceFlag, paymentFlag) => {
    const course = courses[0]
    setWithInvoice(invoiceFlag)
    setWithPayment(paymentFlag)

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

    const data = Object.assign({}, order)
    if (orderDetail.isPackage) {
      data.school_course = courses.map(x => x.id).join(',')
      data.price = parseFloat(orderDetail.price) * 100
    }

    setSubmitted(true)
    setOrderData(data)
    return createSchoolOrder({
      schoolId: course.supplier,
      order: data
    })
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

  if (coursePackage && coursePackage.adding) {
    return (
      <CoursePackageForm
        date={courses[0].date}
        courses={coursePackage.courses}
      />
    )
  }

  return (
    <div className={styles.container}>
      <DateHeading title="Add Order" onBack={handleCancel} />
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

      {!submitted && isFullLicense && (
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
      <AddOrderForm
        info={info}
        course={courses[0]}
        onCancel={handleCancel}
        onSave={handleNewOrder}
        onPayment={handleNewPayment}
        saving={saving}
      />
      {invoiceData && (
        <InvoiceForm
          onSent={handleCancel}
          orderDetail={invoiceData}
          onClose={handleCancel}
        />
      )}
      <LoadingMask loading={withInvoice || saving} />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const schools = state.auth.user ? state.auth.user.suppliers : []
  return {
    newOrder: state.course.newOrder,
    orderDetail: state.course.order,
    schools,
    instructors: state.instructor.instructors,
    info: state.info,
    saving: state.course.single.saving,
    coursePackage: state.course.coursePackage
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createSchoolPayment,
      createSchoolOrder,
      addCoursePackage,
      editCoursePackage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOrderComponent)
