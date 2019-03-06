import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import { ConnectInput } from 'components/ConnectForm'
import styles from './DetailFormContainer.scss'
import { actions, selectors } from 'store/customer'
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
      isChanged: false,
      nameEditable: false
    }

    this.handleSaveCustomer = this.handleSaveCustomer.bind(this)
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this)
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleNameClick = this.handleNameClick.bind(this)
  }

  componentDidMount() {
    if (this.props.id !== 'create') {
      this.props.fetchCustomer(this.props.id)
    }
  }

  componentDidUpdate(prevProps) {
    const { customer, notepad, notepadChanged } = this.props
    const prev = prevProps.customer
    const prevNotepad = prevProps.notepad
    const { editable } = this.state

    if (prev !== customer) {
      if (!customer) {
        this.props.history.push('/customers')
      }

      this.setState({
        editable: { ...customer },
        isChanged: false
      })
    }

    if (prevNotepad !== notepad && notepadChanged) {
      this.handleChangeCustomer({
        ...editable,
        notes: notepad
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
    const { handleNotepadChange } = this.props

    this.setState(
      {
        editable: { ...this.props.customer },
        isChanged: false
      },
      () => {
        handleNotepadChange(this.props.customer.notes, false)
      }
    )
  }

  handleNameClick() {
    this.setState({
      nameEditable: true
    })
  }

  render() {
    const { isSaving } = this.props
    const { editable, isChanged, nameEditable } = this.state
    const isDisabled = !isChanged || isSaving

    return (
      <Col md="4" className={styles.detailFormContainer}>
        <div className={styles.panel}>
          {!nameEditable ? (
            <button
              className={classnames(styles.title, styles.name)}
              onClick={this.handleNameClick}>
              {editable.first_name} {editable.last_name}
            </button>
          ) : (
            <Row>
              <Col>
                <ConnectInput
                  ref={this.firstName}
                  name="first_name"
                  value={editable.first_name || ''}
                  label="First Name"
                  type="text"
                  onChange={({ target: { value } }) => {
                    this.handleChangeCustomer({
                      ...editable,
                      first_name: value
                    })
                  }}
                />
              </Col>
              <Col>
                <ConnectInput
                  name="last_name"
                  value={editable.last_name || ''}
                  label="Last Name"
                  type="text"
                  onChange={({ target: { value } }) => {
                    this.handleChangeCustomer({ ...editable, last_name: value })
                  }}
                />
              </Col>
            </Row>
          )}

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
