import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'

import styles from './DetailFormContainer.scss'
import { actions, selectors } from 'store/customer'
import { getCustomerType, getEmptyCustomer } from 'services/customer'
import CustomerDetailForm from 'pages/Customers/components/CustomerDetailForm'
import Loading from 'components/Loading'

const getLastUpdated = date => {
  return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
}

class DetailFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.customer,
      isChanged: false
    }

    this.handleSaveCustomer = this.handleSaveCustomer.bind(this)
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidMount() {
    if (this.props.id !== 'create') {
      this.props.fetchCustomer(this.props.id)
    }
  }

  componentDidUpdate(prevProps) {
    const { customer } = this.props

    if (prevProps.customer !== customer) {
      this.setState({
        editable: { ...customer },
        isChanged: false
      })
    }
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
      <Col sm="6" className={styles.detailFormContainer}>
        <div className={styles.heading}>
          <h3>
            {editable.first_name} {editable.last_name}
          </h3>
          <div className={styles.customerInfo}>
            <div className={styles.source}>
              {getCustomerType(editable.source)}
            </div>

            {editable.updated_at && (
              <div className={styles.updatedAt}>
                Last updated: {getLastUpdated(editable.updated_at)}
              </div>
            )}
          </div>
        </div>
        <Loading loading={isSaving}>
          <CustomerDetailForm
            customer={editable}
            isDisabled={isDisabled}
            onChange={this.handleChangeCustomer}
            onSave={this.handleSaveCustomer}
            onCancel={this.handleCancel}
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
    customer: selectors.getItem(customer, id) || getEmptyCustomer('DASHBOARD'),
    isSaving: customer.isSaving
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(DetailFormContainer)
