import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'store/customer'
import commonStyles from 'pages/styles.scss'
import CustomerDetailForm from 'pages/Customers/components/CustomerDetailForm'

class DetailFormContainer extends React.Component {
  componentDidMount() {
    this.props.fetchCustomer(this.props.id)
  }

  render() {
    const { customer } = this.props

    return (
      <div className={commonStyles.mainContent}>
        <h3>
          {customer.first_name} {customer.last_name}
        </h3>
        <CustomerDetailForm customer={customer} />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props

  return {
    customer: selectors.getItem(state.customer, id)
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(DetailFormContainer)
