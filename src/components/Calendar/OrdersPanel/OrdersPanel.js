import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import OrdersPanelItem from './OrdersPanelItem'
import styles from './OrdersPanel.scss'
import OrdersPanelSpaceItem from './OrdersPanelSpaceItem'
import AddOrderItem from './AddOrderItem'
import { Button } from 'reactstrap'
import ConfirmModal from 'components/Modals/ConfirmModal'
import Loading from 'components/Loading'
import { BIKE_HIRE } from 'common/constants'

class OrdersPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showConfirmModal: false,
      showDeleteCourseConfirmModal: false,
      addOrderIndex: -1
    }
  }

  handleAdd(index) {
    this.setState({ addOrderIndex: index })
  }

  handleNewOrder(order) {
    const { createSchoolOrder, schoolId, course } = this.props
    if (order.bike_hire === BIKE_HIRE.MANUAL) {
      let manualOrdersCount = course.orders.filter(
        order1 => order1.bike_hire === BIKE_HIRE.MANUAL
      ).length
      if (course.manual_bikes - manualOrdersCount <= 0) {
        alert('Manual bike not available')
        return
      }
    } else if (order.bike_hire === BIKE_HIRE.AUTO) {
      let automaticOrdersCount = course.orders.filter(
        order1 => order1.bike_hire === BIKE_HIRE.AUTO
      ).length
      if (course.auto_bikes - automaticOrdersCount <= 0) {
        alert('Automatic bike not available')
        return
      }
    }

    let response = createSchoolOrder({ schoolId, order })
    return response
  }

  handleRemoveClick() {
    this.setState({ showConfirmModal: true })
  }

  handleRemoveCourseClick() {
    this.setState({ showDeleteCourseConfirmModal: true })
  }

  handleDeleteCourse() {
    let { deleteCourse } = this.props
    this.setState({ showDeleteCourseConfirmModal: false })
    deleteCourse()
  }

  closeDeleteCourseConfirmModal() {
    this.setState({ showDeleteCourseConfirmModal: false })
  }

  handleRemoveSpace() {
    // Remove the space here
    const { updateCourse, schoolId, course } = this.props
    this.setState({ showConfirmModal: false })
    updateCourse({
      schoolId,
      courseId: course.id,
      data: { spaces: course.spaces - 1 }
    })
  }

  closeConfirmModal() {
    this.setState({ showConfirmModal: false })
  }

  render() {
    let { course, info, saving, loading } = this.props
    const {
      showConfirmModal,
      showDeleteCourseConfirmModal,
      addOrderIndex
    } = this.state
    const dateStr = moment(course.date, 'YYYY-MM-DD').format('dddd Do MMMM')
    const backLink = `/calendar/${course.date}`
    const availableSpaces = course.spaces - course.orders.length

    let manualOrdersCount = course.orders.filter(
      order => order.bike_hire === BIKE_HIRE.MANUAL
    ).length
    let automaticOrdersCount = course.orders.filter(
      order => order.bike_hire === BIKE_HIRE.AUTO
    ).length

    return (
      <div className={styles.ordersPanel}>
        <h3>
          {course.time.substring(0, 5)} {course.course_type.name} {dateStr}
        </h3>
        <div>
          <Link to={backLink}>&laquo; Back to day view</Link>
          {course.orders.length === 0 && (
            <Button
              color="danger"
              className="pull-right btn-remove-course"
              onClick={this.handleRemoveCourseClick.bind(this)}>
              Remove Course
            </Button>
          )}
        </div>
        <Loading loading={loading || saving}>
          <h4>Orders</h4>
          <div className={styles.scrollContainer}>
            <div className={styles.scrollContent}>
              <div>
                Bikes available on the course:
                <div>Manual: {course.manual_bikes - manualOrdersCount}</div>
                <div>Automatic: {course.auto_bikes - automaticOrdersCount}</div>
              </div>
              <div className={styles.orders}>
                {course.orders.map((order, index) => (
                  <OrdersPanelItem order={order} key={index} />
                ))}
                {Array.apply(null, Array(availableSpaces)).map(
                  (val, index) =>
                    addOrderIndex === index ? (
                      <AddOrderItem
                        onCancel={() => this.setState({ addOrderIndex: -1 })}
                        info={info}
                        course={course}
                        onSave={this.handleNewOrder.bind(this)}
                        key={index}
                        saving={saving}
                      />
                    ) : (
                      <OrdersPanelSpaceItem
                        onAdd={() => this.handleAdd(index)}
                        onRemove={this.handleRemoveClick.bind(this)}
                        key={index}
                      />
                    )
                )}
              </div>
            </div>
          </div>
        </Loading>
        {showConfirmModal && (
          <ConfirmModal
            onClose={this.closeConfirmModal.bind(this)}
            showModal={true}
            onDelete={this.handleRemoveSpace.bind(this)}
            message={`Are you sure to delete the space?`}
          />
        )}
        {showDeleteCourseConfirmModal && (
          <ConfirmModal
            onClose={this.closeDeleteCourseConfirmModal.bind(this)}
            showModal={true}
            onDelete={this.handleDeleteCourse.bind(this)}
            message={`Are you sure to delete the course?`}
          />
        )}
      </div>
    )
  }
}

export default OrdersPanel
