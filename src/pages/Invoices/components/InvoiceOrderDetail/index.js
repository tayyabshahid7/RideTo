import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {} from 'services/invoice'
import OrdersDetailPanel from 'pages/Orders/components/OrdersDetailPanel'

const InvoiceOrderDetail = ({ ...props }) => {
  console.log('waiting for orders API')
  return <OrdersDetailPanel {...props} isInvoice isEdit orders={[]} />
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceOrderDetail)
