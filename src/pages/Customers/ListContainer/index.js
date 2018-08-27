import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import commonStyles from 'pages/styles.scss'
import CustomerList from 'pages/Customers/components/CustomerList'
import { actions, selectors } from 'store/customer'

class CustomerListContainer extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }

  componentDidMount() {
    this.props.fetchCustomers()
  }

  render() {
    const { customers } = this.props
    console.log('Customers', customers)

    return (
      <div className={commonStyles.mainContent}>
        <h1>Customers</h1>
        <CustomerList customers={customers} />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    customers: selectors.getItems(state.customer)
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(CustomerListContainer)
