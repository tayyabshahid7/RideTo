import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import { Row, Col, Form } from 'reactstrap'

import { ConnectSelect, Button, ConnectTextArea } from 'components/ConnectForm'

import {
  formaBikeTypeForEdit,
  getLicenseFromType,
  getAvailableBikeHires
} from 'common/info'
import { BIKE_HIRE } from 'common/constants'
import {
  getPaymentOptions,
  getTrainingStatusOptions,
  getNonCompleteOptions
} from 'services/order'
import ChangeDate from './ChangeDate/'

class EditOrderForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: props.order
        ? {
            ...props.order,
            bike_type: formaBikeTypeForEdit(props.order)
          }
        : {},
      showChangeDate: false,
      isChanged: false
    }
    console.log(this.state)

    this.handleSave = this.handleSave.bind(this)
    this.handleToggleDateClick = this.handleToggleDateClick.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleConfirmation() {
    const { order } = this.state
    this.props.sendEmailConfirmation(order.order.friendly_id)
  }

  handleChange(typeName, value) {
    const { order } = this.state
    const newOrder = { ...order }

    let type = typeName.split('.')[0]
    let name = typeName.split('.')[1]

    if (!name) {
      newOrder[type] = value
    } else {
      newOrder[type][name] = value
    }

    if (typeName === 'bike_type') {
      newOrder.full_licence_type = getLicenseFromType(value)
    }

    this.setState({
      order: { ...newOrder },
      isChanged: true
    })
  }

  async handleSave(event) {
    const { onSave, onCancel } = this.props
    const { order } = this.state
    const isFullLicence = this.state.order.course_type.startsWith(
      'FULL_LICENCE'
    )

    const data = Object.assign({}, order)
    if (isFullLicence) {
      let type = data.bike_type.toUpperCase().split('_')[1]
      if (data.bike_type === BIKE_HIRE.NO) {
        type = 'NONE'
      }
      data.bike_type = 'BIKE_TYPE_' + type
    }
    console.log(data, order)
    event.preventDefault()
    let response = await onSave(data)
    if (response) {
      onCancel() // close the form on success
    }
  }

  handleToggleDateClick() {
    this.setState(prevState => ({
      showChangeDate: !prevState.showChangeDate
    }))
  }

  render() {
    let {
      onCancel,
      isSending,
      onDelete,
      date,
      time,
      courses,
      onSave,
      times,
      loadTimes,
      isAdmin,
      order
    } = this.props
    const { showChangeDate, isChanged } = this.state

    if (!this.state.order.order || !this.state.order.customer) {
      return null
    }

    const { first_name, last_name, id } = this.state.order.customer
    const { direct_friendly_id, payment_status } = this.state.order.order
    const { bike_type, status, non_completion_reason, notes } = this.state.order

    const isRideTo =
      !direct_friendly_id.includes('DIRECT') &&
      !direct_friendly_id.includes('WIDGET')

    return (
      <div className={styles.container}>
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave}>
          <div className={styles.topSection}>
            <Link to={`/customers/${id}`}>
              {first_name} {last_name}
            </Link>
            <span>{direct_friendly_id}</span>
          </div>

          <ChangeDate
            date={date}
            time={time}
            courses={courses}
            onSave={onSave}
            onCancel={this.handleToggleDateClick}
            times={times}
            loadTimes={loadTimes}
            courseType={this.state.order.course_type}
            disabled={isRideTo || !isAdmin}
          />

          {!showChangeDate && (
            <div>
              <Row>
                <Col sm="10">
                  <ConnectSelect
                    disabled={isRideTo || !isAdmin}
                    name="bike_type"
                    selected={bike_type}
                    label="Bike Hire"
                    options={getAvailableBikeHires(
                      courses.find(course => course.id === order.school_course)
                    )}
                    noSelectOption
                    required
                    valueField="value"
                    labelField="title"
                    basic
                    onChange={value => {
                      this.handleChange('bike_type', value)
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="10">
                  <ConnectSelect
                    label="Training Status"
                    options={getTrainingStatusOptions(isRideTo)}
                    selected={status}
                    name="status"
                    basic
                    onChange={value => {
                      this.handleChange('status', value)
                    }}
                  />
                </Col>
              </Row>
              {status === 'TRAINING_FAILED' && (
                <Row>
                  <Col sm="10">
                    <ConnectSelect
                      placeholder
                      label="Non-Completion Reason"
                      options={getNonCompleteOptions()}
                      selected={non_completion_reason}
                      name="non_completion_reason"
                      basic
                      onChange={value => {
                        this.handleChange('non_completion_reason', value)
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="10">
                  <ConnectSelect
                    disabled={isRideTo}
                    name="order.payment_status"
                    selected={payment_status}
                    label="Payment Status"
                    options={getPaymentOptions()}
                    noSelectOption
                    required
                    valueField="id"
                    labelField="name"
                    basic
                    onChange={value => {
                      this.handleChange('order.payment_status', value)
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="10">
                  <ConnectTextArea
                    basic
                    name="notes"
                    value={notes || ''}
                    label="Notes"
                    className="form-group"
                    type="text"
                    onChange={({ target: { value } }) => {
                      this.handleChange('notes', value)
                    }}
                  />
                </Col>
              </Row>
              {/* TODO PRODEV-1112 Needs BACKEND
              <Row>
                <Col sm="10">
                  <ConnectLabeledContent label="Price paid" disabled basic>
                    {`£${parseFloat(0).toFixed(2)}`}
                  </ConnectLabeledContent>
                </Col>
                <Col sm="10">
                  <ConnectLabeledContent label="Stripe link" disabled basic>
                    <a href={0} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </ConnectLabeledContent>
                </Col>
              </Row>
              */}
              <div className={styles.comms}>
                <Button
                  small
                  disabled={isSending}
                  color="primary"
                  outline
                  onClick={this.handleConfirmation}>
                  Send Confirmation
                </Button>
              </div>
              <div className={styles.buttons}>
                <Button
                  small
                  type="submit"
                  color="primary"
                  disabled={!isChanged}>
                  Save
                </Button>
                <Button small color="white" onClick={onCancel}>
                  Cancel
                </Button>
                {isAdmin && (
                  <Button
                    small
                    color="danger"
                    className={styles.deleteButton}
                    onClick={onDelete}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </Form>
        {/* </Loading> */}
      </div>
    )
  }
}

export default EditOrderForm
