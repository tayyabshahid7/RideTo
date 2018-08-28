import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'store/customer'
import commonStyles from 'pages/styles.scss'
import CustomerDetailForm from 'pages/Customers/components/CustomerDetailForm'

class DetailFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.customer ? { ...props.customer } : {}
    }

    this.handleSaveCustomer = this.handleSaveCustomer.bind(this)
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount() {
    this.props.fetchCustomer(this.props.id)
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props

    if (prevProps.customer.id !== customer.id) {
      this.setState({ editable: { ...customer } })
    }
  }

  handleSaveCustomer() {
    this.props.saveCustomer(this.state.editable, this.props.history)
  }

  handleChangeCustomer(editable) {
    this.setState({ editable })
  }

  handleCancel() {
    this.setState({ editable: { ...this.props.customer } })
  }

  render() {
    const { editable } = this.state

    return (
      <div className={commonStyles.mainContent}>
        <h3>
          {editable.first_name} {editable.last_name}
        </h3>
        <CustomerDetailForm
          editable={editable}
          onChange={this.handleChangeCustomer}
          onSave={this.handleSaveCustomer}
          onCancel={this.handleCancel}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props

  return {
    customer: selectors.getItem(state.customer, id) || {}
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(DetailFormContainer)
