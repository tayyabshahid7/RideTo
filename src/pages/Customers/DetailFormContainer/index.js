import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import styles from './DetailFormContainer.scss'
import { actions, selectors } from 'store/customer'
import { getEmptyCustomer } from 'services/customer'
import CustomerDetailForm from 'pages/Customers/components/CustomerDetailForm'
import UserName from 'pages/Customers/components/UserName'
import Loading from 'components/Loading'
import classnames from 'classnames'

class DetailFormContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.customer || getEmptyCustomer('DASHBOARD'),
      isChanged: false,
      nameEditable: false,
      showActions: false,
      showConfirmModal: false
    }

    this.handleSaveCustomer = this.handleSaveCustomer.bind(this)
    this.handleChangeCustomer = this.handleChangeCustomer.bind(this)
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleNameClick = this.handleNameClick.bind(this)
    this.handleActionsClick = this.handleActionsClick.bind(this)
    this.handleToggleModal = this.handleToggleModal.bind(this)
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
        if (this.props.customer) {
          handleNotepadChange(this.props.customer.notes, false)
        }
      }
    )
  }

  handleNameClick() {
    this.setState({
      nameEditable: true
    })
  }

  handleActionsClick() {
    this.setState({
      showActions: !this.state.showActions
    })
  }

  handleToggleModal() {
    this.setState({ showConfirmModal: !this.state.showConfirmModal })
  }

  render() {
    const { isSaving, customer, id } = this.props
    const {
      editable,
      isChanged,
      nameEditable,
      showActions,
      showConfirmModal
    } = this.state
    const isDisabled = !isChanged || isSaving
    const isCreateUser = id === 'create'
    const hasActions =
      ['WIDGET', 'DASHBOARD'].includes(editable.source) && !isCreateUser

    return (
      <Col md="4" className={styles.detailFormContainer}>
        <UserName
          nameEditable={nameEditable}
          hasActions={hasActions}
          customer={customer}
          editable={editable}
          showActions={showActions}
          showConfirmModal={showConfirmModal}
          handleActionsClick={this.handleActionsClick}
          handleNameClick={this.handleNameClick}
          handleToggleModal={this.handleToggleModal}
          handleChangeCustomer={this.handleChangeCustomer}
          handleDeleteCustomer={this.handleDeleteCustomer}
        />
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
