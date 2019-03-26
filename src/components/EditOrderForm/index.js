import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import { Row, Col, Form } from 'reactstrap'

import {
  ConnectSelect,
  ConnectLabeledContent,
  Button
} from 'components/ConnectForm'

import { BikeHires, formatBikeConstant, FullLicenceTypes } from 'common/info'
import { getPaymentOptions, getTrainingStatusOptions } from 'services/order'
import ChangeDate from './ChangeDate/'

class EditOrderForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: props.order
        ? {
            ...props.order,
            bike_type: formatBikeConstant(props.order.bike_type)
          }
        : {},
      showChangeDate: false,
      isChanged: false
    }

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

    this.setState({
      order: { ...newOrder },
      isChanged: true
    })
  }

  async handleSave(event) {
    const { onSave, onCancel } = this.props
    const { order } = this.state
    event.preventDefault()
    let response = await onSave(order)
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
      loadTimes
    } = this.props
    const { showChangeDate, isChanged } = this.state

    if (!this.state.order.order || !this.state.order.customer) {
      return null
    }

    const { first_name, last_name, id } = this.state.order.customer
    const { direct_friendly_id, payment_status } = this.state.order.order
    const { bike_type, full_licence_type, status } = this.state.order
    const isFullLicence = this.state.order.course_type.startsWith(
      'FULL_LICENCE'
    )

    return (
      <div className={styles.container}>
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave}>
          <div className={styles.deleteWrap}>
            <Button color="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
          <div className={styles.topSection}>
            <div>
              <div className={styles.header}>
                <h4>Edit Order {direct_friendly_id}</h4>
              </div>
              <ConnectLabeledContent label="Customer" disabled basic>
                <b>
                  <Link to={`/customers/${id}`}>
                    {first_name} {last_name}
                  </Link>
                </b>
              </ConnectLabeledContent>
            </div>
          </div>

          <ChangeDate
            date={date}
            time={time}
            courses={courses}
            onSave={onSave}
            onCancel={this.handleToggleDateClick}
            times={times}
            loadTimes={loadTimes}
          />

          {!showChangeDate && (
            <div>
              <Row>
                <Col sm="8">
                  <ConnectSelect
                    name="bike_type"
                    selected={bike_type}
                    label="Bike hire"
                    options={BikeHires}
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
              {isFullLicence && (
                <Row>
                  <Col sm="8">
                    <ConnectSelect
                      name="full_licence_type"
                      selected={full_licence_type}
                      label="Licence Type *"
                      options={FullLicenceTypes}
                      required
                      valueField="value"
                      labelField="title"
                      basic
                      onChange={value => {
                        this.handleChange('full_licence_type', value)
                      }}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="6">
                  <ConnectSelect
                    label="Training status"
                    options={getTrainingStatusOptions()}
                    selected={status}
                    name="status"
                    basic
                    onChange={value => {
                      this.handleChange('status', value)
                    }}
                  />
                </Col>
                <Col sm="6">
                  <ConnectSelect
                    name="order.payment_status"
                    selected={payment_status}
                    label="Payment status"
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
              {/* TODO PRODEV-1112 Needs BACKEND
              <Row>
                <Col sm="6">
                  <ConnectLabeledContent label="Price paid" disabled basic>
                    {`£${parseFloat(0).toFixed(2)}`}
                  </ConnectLabeledContent>
                </Col>
                <Col sm="6">
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
                  disabled={isSending}
                  color="primary"
                  outline
                  onClick={this.handleConfirmation}>
                  Send Confirmation
                </Button>
              </div>
              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="mr-2"
                  disabled={!isChanged}>
                  Save
                </Button>
                <Button color="white" onClick={onCancel}>
                  Cancel
                </Button>
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
