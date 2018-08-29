import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as orderModule from 'store/order'
import * as supplierModule from 'store/supplier'

import OrderForm from 'pages/Customers/components/OrderForm'

class OrderListContainer extends React.Component {
  componentDidMount() {
    const { id } = this.props

    this.props.fetchOrders({ customer: parseInt(id, 10) })
    this.props.fetchSuppliers()
  }

  render() {
    const { orders, suppliers } = this.props

    return (
      <div>
        {orders.map(order => (
          <OrderForm
            key={order.friendly_id}
            order={order}
            suppliers={suppliers}
          />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const id = parseInt(props.id, 10)

  return {
    orders: orderModule.selectors.getOrdersByCustomer(state.order, id),
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
