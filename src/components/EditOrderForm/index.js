import React from 'react'
import styles from './styles.scss'
import { Row, Col, Form } from 'reactstrap'

import { ConnectSelect, Button, ConnectTextArea } from 'components/ConnectForm'

import {
  getFullLicenseType,
  getAvailableBikeHires,
  getTestResultOptions
} from 'common/info'
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
      order: props.order || {},
      showChangeDate: false,
      isChanged: false
    }
  }

  handleConfirmation = () => {
    const { order } = this.state
    this.props.sendEmailConfirmation(order.order.friendly_id)
  }

  handleChange = (typeName, value) => {
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
      newOrder.full_licence_type = getFullLicenseType(value)
    }

    this.setState({
      order: { ...newOrder },
      isChanged: true
    })
  }

  handleSave = async event => {
    const { onSave, onCancel } = this.props
    const { order } = this.state
    const data = Object.assign({}, order)

    event.preventDefault()
    let response = await onSave(data)
    if (response) {
      onCancel() // close the form on success
    }
  }

  handleToggleDateClick = () => {
    this.setState(prevState => ({
      showChangeDate: !prevState.showChangeDate
    }))
  }

  handleDelete = () => {
    const { order, onDelete } = this.props
    const canDelete =
      order &&
      order.order &&
      (order.order.source === 'DASHBOARD' || order.order.source === 'WIDGET')

    if (canDelete) {
      onDelete()
    }
  }

  render() {
    let {
      onCancel,
      isSending,
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
    const canDelete =
      order &&
      order.order &&
      (order.order.source === 'DASHBOARD' || order.order.source === 'WIDGET')

    if (!this.state.order.order || !this.state.order.customer) {
      return null
    }

    const { direct_friendly_id, payment_status } = this.state.order.order
    const {
      bike_type,
      test_result,
      status,
      non_completion_reason,
      notes
    } = this.state.order

    const isRideTo =
      !direct_friendly_id.includes('DIRECT') &&
      !direct_friendly_id.includes('WIDGET')

    const course = courses.find(course => course.id === order.school_course)

    let prevBikeType = null
    if (this.props.order) {
      prevBikeType = this.props.order.bike_type
    }
    const bikeTypeOptions = getAvailableBikeHires(course, prevBikeType)

    const isFullLicenceTest =
      order &&
      order.course_type &&
      order.course_type.startsWith('FULL_LICENCE') &&
      order.course_type.endsWith('TEST')

    const testResultOptions = getTestResultOptions()

    return (
      <div className={styles.container}>
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave}>
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
                <Col>
                  <ConnectSelect
                    disabled={isRideTo || !isAdmin}
                    name="bike_type"
                    selected={bike_type}
                    label="Bike Hire"
                    options={bikeTypeOptions}
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
              {isFullLicenceTest && (
                <Row>
                  <Col>
                    <ConnectSelect
                      disabled={isRideTo || !isAdmin}
                      name="test_result"
                      selected={test_result}
                      label="Test Result"
                      options={testResultOptions}
                      noSelectOption
                      required
                      basic
                      onChange={value => {
                        this.handleChange('test_result', value)
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col>
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
                  <Col>
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
                <Col>
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
                <Col>
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
                <Col>
                  <ConnectLabeledContent label="Price paid" disabled basic>
                    {`£${parseFloat(0).toFixed(2)}`}
                  </ConnectLabeledContent>
                </Col>
                <Col>
                  <ConnectLabeledContent label="Stripe link" disabled basic>
                    <a href={0} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  </ConnectLabeledContent>
                </Col>
              </Row>
              */}
              <div className={styles.actions}>
                <div>
                  <Button
                    disabled={isSending}
                    color="primary"
                    outline
                    onClick={this.handleConfirmation}>
                    Send Confirmation
                  </Button>
                </div>
                <div>
                  <Button type="submit" color="primary" disabled={!isChanged}>
                    Save
                  </Button>
                </div>
                <div>
                  <Button color="white" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
                <div>
                  {isAdmin && (
                    <Button
                      color="danger"
                      className={styles.deleteButton}
                      disabled={!canDelete}
                      onClick={this.handleDelete}>
                      Delete
                    </Button>
                  )}
                </div>
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
