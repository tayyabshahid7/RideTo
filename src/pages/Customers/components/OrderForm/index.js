import React from 'react'
import moment from 'moment'
import { Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'

import MinimalSelect from 'components/MinimalSelect'
import Loading from 'components/Loading'
import {
  getBikeHireOptions,
  getPaymentOptions,
  getTrainingStatusOptions,
  sendConfirmation,
  isRideTo
} from 'services/order'
import styles from './OrderForm.scss'

const BIKE_HIRE_OPTIONS = Object.keys(getBikeHireOptions()).map(id => {
  return {
    id,
    name: getBikeHireOptions()[id]
  }
})

const getTime = startTime => {
  if (startTime) {
    return moment(new Date(startTime)).format('HH:mm')
  }
}

const getDate = startTime => {
  if (startTime) {
    return moment(new Date(startTime)).format('YYYY-MM-DD')
  }
}

class OrderForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: { ...props.order },
      isChanged: false,
      isSending: false
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.order !== this.props.order) {
      this.setState({
        editable: { ...this.props.order },
        isChanged: false
      })
    }
  }

  handleChange(name, value) {
    const { editable } = this.state

    this.setState({
      editable: { ...editable, [name]: value },
      isChanged: true
    })
  }

  handleChangeStartTime(value) {
    const { editable } = this.state
    const date = new Date(editable.start_time)
    const [hours, minutes] = value.split(':')

    date.setHours(hours)
    date.setMinutes(minutes)

    this.handleChange('start_time', date.toISOString())
  }

  handleChangeStartDate(value) {
    const { editable } = this.state
    const date = editable.start_time || new Date().toISOString()

    this.handleChange('start_time', `${value}${date.slice(10)}`)
  }

  handleCancel() {
    this.setState({
      editable: { ...this.props.order },
      isChanged: false
    })
  }

  async handleConfirmation() {
    const { editable } = this.state
    this.setState({ isSending: true })
    await sendConfirmation(editable)
    this.setState({ isSending: false })
  }

  render() {
    const { suppliers, isSaving, onSave } = this.props
    const { editable, isChanged, isSending } = this.state
    const selectedSupplier = suppliers.find(
      ({ id }) => id === editable.supplier
    )
    const courses = selectedSupplier ? selectedSupplier.courses : []
    const isDisabled = !isChanged || isSaving

    return (
      <div className={styles.orderForm}>
        <h4>Order: #{editable.friendly_id}</h4>
        <Loading loading={isSaving}>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label>Training Site</Label>
                <MinimalSelect
                  className={styles.select}
                  disabled={isRideTo(editable)}
                  options={suppliers}
                  selected={editable.supplier || ''}
                  onChange={value => {
                    this.handleChange('supplier', parseInt(value, 10))
                  }}
                />
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label>Training</Label>
                <MinimalSelect
                  className={styles.select}
                  disabled={isRideTo(editable)}
                  options={courses}
                  valueField="constant"
                  selected={editable.selected_licence || ''}
                  onChange={value => {
                    this.handleChange('selected_licence', value)
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <FormGroup>
                <Label>Training Date</Label>
                <Input
                  type="date"
                  disabled={isRideTo(editable)}
                  value={getDate(editable.start_time) || ''}
                  onChange={({ target }) =>
                    this.handleChangeStartDate(target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label>Training Time</Label>
                <Input
                  type="time"
                  disabled={isRideTo(editable)}
                  value={getTime(editable.start_time) || ''}
                  onChange={({ target }) =>
                    this.handleChangeStartTime(target.value)
                  }
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label>Bike Hire</Label>
                <MinimalSelect
                  className={styles.select}
                  options={BIKE_HIRE_OPTIONS}
                  selected={editable.bike_hire || ''}
                  onChange={value => {
                    this.handleChange('bike_hire', value)
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label>Payment Status</Label>
                <MinimalSelect
                  className={styles.select}
                  options={getPaymentOptions()}
                  disabled={isRideTo(editable)}
                  selected={editable.status || ''}
                  onChange={value => {
                    this.handleChange('status', value)
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Training Status</Label>
                <MinimalSelect
                  className={styles.select}
                  options={getTrainingStatusOptions()}
                  selected={editable.training_status || ''}
                  onChange={value => {
                    this.handleChange('training_status', value)
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label>Stripe</Label>
                <a className={styles.link} href={editable.stripe_charge_href}>
                  {editable.stripe_charge_href}
                </a>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label>Amount Paid</Label>
                <Input
                  type="text"
                  disabled={isRideTo(editable)}
                  value={editable.payout}
                  name="payout"
                  onChange={({ target }) =>
                    this.handleChange(target.name, target.value)
                  }
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                disabled={isSending}
                color="outline"
                onClick={this.handleConfirmation}>
                Send Confirmation
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className={styles.actions}>
              <Button
                disabled={isDisabled}
                color="primary"
                onClick={() => onSave(editable)}>
                Save
              </Button>
              <Button
                color="link"
                disabled={isDisabled}
                onClick={this.handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Loading>
      </div>
    )
  }
}

export default OrderForm
