import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'

import styles from './DetailFormContainer.scss'
import { actions, selectors } from 'store/customer'
// import { getCustomerType, getEmptyCustomer } from 'services/customer'
import { getEmptyCustomer } from 'services/customer'
import CustomerDetailForm from 'pages/Customers/components/CustomerDetailForm'
import Loading from 'components/Loading'
import classnames from 'classnames'

const getLastUpdated = date => {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
}

class DetailFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.customer || getEmptyCustomer('DASHBOARD'),
      isChanged: false
    }

    this.handleSaveCustomer = this.handleSaveCustomer.bind(this)
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this)
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount() {
    if (this.props.id !== 'create') {
      this.props.fetchCustomer(this.props.id)
    }
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props
    const prev = prevProps.customer

    if (prev !== customer) {
      if (!customer) {
        this.props.history.push('/customers')
      }

      this.setState({
        editable: { ...customer },
        isChanged: false
      })
    }
  }

  handleDeleteCustomer() {
    const { customer } = this.props
    this.props.destroyCustomer(customer.id)
  }

  handleSaveCustomer() {
    this.props.saveCustomer(this.state.editable, this.props.history)
  }

  handleChangeCustomer(editable) {
    this.setState({ editable, isChanged: true })
  }

  handleCancel() {
    this.setState({
      editable: { ...this.props.customer },
      isChanged: false
    })
  }

  render() {
    const { isSaving } = this.props
    const { editable, isChanged } = this.state
    const isDisabled = !isChanged || isSaving

    return (
      <Col sm="4" className={styles.detailFormContainer}>
        <div className={styles.panel}>
          <h3 className={styles.title}>
            {editable.first_name} {editable.last_name}
          </h3>
          <div className={styles.customerInfo}>
            {editable.updated_at && (
              <div className={styles.updatedAt}>
                Last updated: {getLastUpdated(editable.updated_at)}
              </div>
            )}
          </div>
        </div>
        <Loading loading={isSaving}>
          <h3 className={classnames(styles.title, styles.details)}>
            Customer details
          </h3>
          <CustomerDetailForm
            customer={editable}
            isDisabled={isDisabled}
            onChange={this.handleChangeCustomer}
            onSave={this.handleSaveCustomer}
            onCancel={this.handleCancel}
            onDelete={this.handleDeleteCustomer}
          />
        </Loading>
      </Col>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props
  const { customer } = state

  return {
    customer: selectors.getItem(customer, id),
    isSaving: customer.isSaving
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(DetailFormContainer)
