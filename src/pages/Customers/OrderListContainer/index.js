import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'

import * as orderModule from 'store/order'
import * as supplierModule from 'store/supplier'
import OrderForm from 'pages/Customers/components/OrderForm'
import styles from './OrderListContainer.scss'

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
    this.props.saveOrder(order)
  }

  render() {
    const { orders, suppliers, isSaving } = this.props

    return (
      <Col className={styles.orderListContainer}>
        <h3 className={styles.title}>Training</h3>
        {orders.map(order => (
          <OrderForm
            key={order.friendly_id}
            order={order}
            suppliers={suppliers}
            onSave={this.handleSave}
            isSaving={isSaving}
          />
        ))}
      </Col>
    )
  }
}

const mapStateToProps = (state, props) => {
  const id = parseInt(props.id, 10)

  return {
    orders: orderModule.selectors.getOrdersByCustomer(state.order, id),
    isSaving: state.order.isSaving,
    suppliers: supplierModule.selectors.getItems(state.supplier)
  }
}

export default connect(
  mapStateToProps,
  dispatch =>
    bindActionCreators(
      {
        ...orderModule.actions,
        ...supplierModule.actions
      },
      dispatch
    )
)(OrderListContainer)
