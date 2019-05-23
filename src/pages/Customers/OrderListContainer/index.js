import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Col } from 'reactstrap'
import { loadCourseTypes } from 'store/info'
import * as orderModule from 'store/order'
import * as supplierModule from 'store/supplier'
import { getEmails, sendEmail } from 'store/email'
import Tabs from 'pages/Customers/components/Tabs'
import OrderForm from 'pages/Customers/components/OrderForm'
import Email from 'pages/Customers/components/Email'
import NewEmail from 'pages/Customers/components/NewEmail'
import styles from './OrderListContainer.scss'
import { selectors } from 'store/customer'

class OrderListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount() {
    const { id, schoolId } = this.props
    if (id !== 'create') {
      this.props.fetchOrders({ customer: parseInt(id, 10) })
      this.props.getEmails(id, schoolId, schoolId)
    }
    this.props.fetchSuppliers()
  }

  handleSave(order) {
    if (order.payout && order.payout.includes('£')) {
      order.payout = order.payout.replace('£', '')
    }
    this.props.saveTraining(order)
  }

  render() {
    const {
      orders,
      suppliers,
      isSaving,
      loadCourseTypes,
      isSending,
      sendEmailConfirmation,
      info,
      notepad,
      handleNotepadChange,
      user,
      customer,
      emails = [],
      sendEmail
    } = this.props

    return (
      <Col className={styles.orderListContainer}>
        <Tabs>
          <div label="Orders">
            {orders.length > 0 ? (
              <ul className={styles.list}>
                {orders.map(order => (
                  <li key={order.id} className={styles.listItem}>
                    <OrderForm
                      courseTypes={info.courseTypes}
                      order={order}
                      suppliers={suppliers}
                      onSave={this.handleSave}
                      isSaving={isSaving}
                      loadCourseTypes={loadCourseTypes}
                      isSending={isSending}
                      sendEmailConfirmation={sendEmailConfirmation}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noOrder}>No orders</div>
            )}
          </div>
          <div label="Email">
            {user && customer && (
              <NewEmail
                customer={customer}
                user={user}
                onSendEmail={sendEmail}
              />
            )}
            {emails.length > 0 ? (
              <ul className={styles.list}>
                {emails.map(email => (
                  <li key={email.id} className={styles.listItem}>
                    <Email email={email} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noOrder}>No emails</div>
            )}
          </div>
          <div label="Notes">
            <textarea
              className={styles.notepad}
              placeholder="Add notes here"
              value={notepad || ''}
              onChange={({ target: { value } }) => {
                handleNotepadChange(value)
              }}
            />
          </div>
        </Tabs>
      </Col>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props
  const { customer } = state

  return {
    customer: selectors.getItem(customer, id),
    orders: id !== 'create' ? orderModule.selectors.getItems(state.order) : [],
    isSaving: state.order.isSaving,
    isSending: state.order.isSending,
    suppliers: supplierModule.selectors.getItems(state.supplier),
    info: state.info,
    user: state.auth.user,
    emails: state.email.emails,
    schoolId: state.auth.schoolId
  }
}

export default connect(
  mapStateToProps,
  dispatch =>
    bindActionCreators(
      {
        ...orderModule.actions,
        ...supplierModule.actions,
        loadCourseTypes,
        getEmails,
        sendEmail
      },
      dispatch
    )
)(OrderListContainer)
