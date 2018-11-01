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
            {course.orders.map((order, index) => (
              <React.Fragment key={index}>
                <OrdersPanelItem
                  order={order}
                  onEdit={() => this.handleShowEditForm(index)}
                  showEditButton={order.is_manual_order && showEditButton}
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
                    friendlyId={order.friendly_id}
                  />
                )}
              </React.Fragment>
            ))}
            {Array.apply(null, Array(availableSpaces)).map(
              (val, index) =>
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