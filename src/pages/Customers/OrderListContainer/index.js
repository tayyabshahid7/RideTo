import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import { loadCourseTypes } from 'store/info'
import * as orderModule from 'store/order'
import * as supplierModule from 'store/supplier'
import Tabs from 'pages/Customers/components/Tabs'
import OrderForm from 'pages/Customers/components/OrderForm'
import styles from './OrderListContainer.scss'
import { selectors } from 'store/customer'

class OrderListContainer extends React.Component {
  componentDidMount() {
    const { id } = this.props
    if (id !== 'create') {
      this.props.fetchOrders({ customer: parseInt(id, 10) })
    }
    this.props.fetchSuppliers()

    this.handleSave = this.handleSave.bind(this)
  }

  handleSave(order) {
    if (order.payout && order.payout.includes('£')) {
      order.payout = order.payout.replace('£', '')
    }
    this.props.saveTraining(order)
  }

  render() {
    const {
      customer,
      orders,
      suppliers,
      isSaving,
      loadCourseTypes,
      info,
      notepad,
      handleNotepadChange
    } = this.props

    return (
      <Col className={styles.orderListContainer}>
        <Tabs customer={customer}>
          <div label="Orders">
            {orders.length > 0 ? (
              <ul className={styles.list}>
                {orders.map(order => (
                  <li key={order.id} className={styles.listItem}>
                    <OrderForm
                      courseTypes={info.courseTypes}
                      order={order}
                      suppliers={suppliers}
                      onSave={this.handleSave}
                      isSaving={isSaving}
                      loadCourseTypes={loadCourseTypes}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div>No orders</div>
            )}
          </div>
          <div label="Notes">
            <textarea
              className={styles.notepad}
              placeholder="Add notes here"
              value={notepad || ''}
              onChange={({ target: { value } }) => {
                handleNotepadChange(value)
              }}
            />
          </div>
        </Tabs>
      </Col>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props
  const { customer } = state

  return {
    customer: selectors.getItem(customer, id),
    orders: id !== 'create' ? orderModule.selectors.getItems(state.order) : [],
    isSaving: state.order.isSaving,
    suppliers: supplierModule.selectors.getItems(state.supplier),
    info: state.info
  }
}

export default connect(
  mapStateToProps,
  dispatch =>
    bindActionCreators(
      {
        ...orderModule.actions,
        ...supplierModule.actions,
        loadCourseTypes
      },
      dispatch
    )
)(OrderListContainer)
