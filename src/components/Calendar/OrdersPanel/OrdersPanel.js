import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import OrdersPanelItem from './OrdersPanelItem'
import styles from './OrdersPanel.scss'
import OrdersPanelSpaceItem from './OrdersPanelSpaceItem'
import { Button } from 'reactstrap'
import ConfirmModal from 'components/Modals/ConfirmModal'

class OrdersPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showConfirmModal: false,
      showDeleteCourseConfirmModal: false
    }
  }
  handleAdd() {}

  handleRemoveClick() {
    this.setState({ showConfirmModal: true })
  }

  handleRemoveCourseClick() {
    this.setState({ showDeleteCourseConfirmModal: true })
  }

  handleDeleteCourse() {
    let { deleteCourse } = this.props
    deleteCourse()
  }

  closeDeleteCourseConfirmModal() {
    this.setState({ showDeleteCourseConfirmModal: false })
  }

  handleRemoveSpace() {
    // Remove the space here
  }

  closeConfirmModal() {
    this.setState({ showConfirmModal: false })
  }

  render() {
    let { course } = this.props
    const { showConfirmModal, showDeleteCourseConfirmModal } = this.state
    const dateStr = moment(course.date, 'YYYY-MM-DD').format('dddd Do MMMM')
    const backLink = `/calendar/${course.date}`
    const availableSpaces = course.spaces - course.orders.length
    return (
      <div className={styles.ordersPanel}>
        <h3>
          {course.time} {course.course_type.name} {dateStr}
        </h3>
        <Link to={backLink}>&laquo; Back to day view</Link>
        {course.orders.length === 0 && (
          <Button
            color="danger"
            className="pull-right btn-remove-course"
            onClick={this.handleRemoveCourseClick.bind(this)}>
            Remove Course
          </Button>
        )}
        <h4>Orders</h4>
        <div>
          Bikes available on the course:
          <div>Manual: {course.manual_bikes}</div>
          <div>Automatic: {course.auto_bikes}</div>
        </div>
        <div className={styles.orders}>
          {course.orders.map((order, index) => (
            <OrdersPanelItem order={order} key={index} />
          ))}
          {Array.apply(null, Array(availableSpaces)).map((val, index) => (
            <OrdersPanelSpaceItem
              onAdd={this.handleAdd.bind(this)}
              onRemove={this.handleRemoveClick.bind(this)}
              key={index}
            />
          ))}
        </div>
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
