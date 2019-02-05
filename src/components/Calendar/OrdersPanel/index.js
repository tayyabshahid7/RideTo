import React from 'react'
import styles from './OrdersPanel.scss'
import OrdersPanelSpaceItem from './OrdersPanelSpaceItem'
import AddOrderItem from './AddOrderItem'
import EditOrderFormContainer from 'pages/Calendar/EditOrderFormContainer'
import OrdersPanelItem from 'components/Calendar/OrdersPanelItem'
import Loading from 'components/Loading'
import { BIKE_HIRE } from 'common/constants'

class OrdersPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEditButton: true,
      orderIndex: -1,
      editOrderIndex: -1
    }
  }

  handleAdd(index) {
    this.setState({ orderIndex: index })
  }

  handleShowEditForm(index) {
    this.setState({ editOrderIndex: index, showEditButton: false })
  }

  handleNewOrder(order) {
    const { createSchoolOrder, schoolId, course } = this.props

    if (!order.full_licence_type) {
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

    return createSchoolOrder({ schoolId, order })
  }

  render() {
    const { course, info, saving, loading } = this.props
    const { orderIndex, editOrderIndex, showEditButton } = this.state
    const availableSpaces = Math.max(course.spaces - course.orders.length, 0)

    return (
      <div className={styles.ordersPanel}>
        <Loading loading={loading || saving}>
          <div className={styles.orders}>
            {course.orders.map((training, index) => (
              <React.Fragment key={index}>
                <OrdersPanelItem
                  training={training}
                  onEdit={() => this.handleShowEditForm(index)}
                  showEditButton={
                    // TODO-man-ord If change Orders models in webapp change this too
                    (training.is_manual_order ||
                      training.direct_friendly_id.startsWith('DIRECT')) &&
                    showEditButton
                  }
                />
                {editOrderIndex === index && (
                  <EditOrderFormContainer
                    updateCourse={this.props.updateCourse}
                    onCancel={() =>
                      this.setState({
                        editOrderIndex: -1,
                        showEditButton: true
                      })
                    }
                    trainingId={training.id}
                    course_type={course.course_type.constant}
                    courseId={course.id}
                    courseSpaces={course.spaces}
                    date={course.date}
                    time={course.time}
                  />
                )}
              </React.Fragment>
            ))}
            {Array.apply(null, Array(availableSpaces)).map((val, index) =>
              orderIndex === index ? (
                <AddOrderItem
                  onCancel={() => this.setState({ orderIndex: -1 })}
                  info={info}
                  course={course}
                  onSave={this.handleNewOrder.bind(this)}
                  key={index}
                  saving={saving}
                />
              ) : (
                <OrdersPanelSpaceItem
                  onAdd={() => this.handleAdd(index)}
                  key={index}
                />
              )
            )}
          </div>
        </Loading>
      </div>
    )
  }
}

export default OrdersPanel
