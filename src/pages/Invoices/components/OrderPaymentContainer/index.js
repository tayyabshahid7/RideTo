import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { STRIPE_KEY } from 'common/constants'
import { StripeProvider, Elements } from 'react-stripe-elements'
import OrderPaymentForm from '../OrderPaymentForm'

const OrderPaymentContainer = ({
  invoiceId,
  customer,
  orderId,
  amount,
  onRefresh,
  onPaid,
  suppliers
}) => {
  const stripeAccountId = suppliers.length
    ? suppliers[0].stripe_account_id
    : null

  return (
    <StripeProvider apiKey={STRIPE_KEY} stripeAccount={stripeAccountId}>
      <Elements>
        <OrderPaymentForm
          invoiceId={invoiceId}
          customer={customer}
          amount={amount}
          orderId={orderId}
          onRefresh={onRefresh}
          onPaid={onPaid}
        />
      </Elements>
    </StripeProvider>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    suppliers: state.auth.user.suppliers
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPaymentContainer)
