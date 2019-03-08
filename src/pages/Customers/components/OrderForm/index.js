import React from 'react'
import moment from 'moment'
import { Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'

import MinimalSelect from 'components/MinimalSelect'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { FullLicenceTypes } from 'common/info'
import Loading from 'components/Loading'
import {
  getBikeHireOptions,
  getPaymentOptions,
  getTrainingStatusOptions,
  isRideTo,
  isConnectManual
} from 'services/order'
import styles from './OrderForm.scss'

const get_bike_hire_option = option => {
  if (option === 'BIKE_TYPE_MANUAL') {
    return 'manual'
  } else if (option === 'BIKE_TYPE_AUTO') {
    return 'auto'
  } else if (option === 'BIKE_TYPE_NONE') {
    return 'no'
  } else {
    return option
  }
}

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
      editable: {
        application_reference_number: '',
        ...props.order
      },
      isChanged: false,
      isSending: false,
      courseTypes: []
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
  }

  componentDidMount() {
    const { loadCourseTypes } = this.props
    const { training_location } = this.state.editable

    loadCourseTypes({ schoolId: training_location })
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

  handleCancel() {
    this.setState({
      editable: { ...this.props.order },
      isChanged: false
    })
  }

  handleConfirmation() {
    // const { editable } = this.state
    // this.setState({ isSending: true })
    // await sendConfirmation(editable)
    // this.setState({ isSending: false })

    const { editable } = this.state
    this.props.sendEmailConfirmation(editable.friendly_id)
  }

  render() {
    const { suppliers, isSaving, onSave, courseTypes, isSending } = this.props
    const { editable, isChanged } = this.state
    const courses = courseTypes
      ? courseTypes.filter(
          course =>
            !['TFL_ONE_ON_ONE', 'FULL_LICENCE'].includes(course.constant)
        )
      : []
    const isDisabled = !isChanged || isSaving

    if (!editable) {
      return null
    }

    const isFullLicence =
      editable.selected_licence &&
      editable.selected_licence.startsWith('FULL_LICENCE')
    const bikeHireOptions = Object.keys(getBikeHireOptions()).map(id => {
      return {
        id,
        name: getBikeHireOptions(isFullLicence)[id]
      }
    })

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
                  selected={editable.training_location || ''}
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
                  disabled={true && isRideTo(editable)}
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
                  disabled={true}
                  value={
                    moment(getDate(editable.training_date_time)).format(
                      'DD/MM/YYYY'
                    ) || ''
                  }
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label>Training Time</Label>
                <Input
                  type="time"
                  disabled={true}
                  value={getTime(editable.training_date_time) || ''}
                />
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label>Bike Hire</Label>
                <MinimalSelect
                  className={styles.select}
                  options={bikeHireOptions}
                  selected={get_bike_hire_option(editable.bike_type) || ''}
                  onChange={value => {
                    this.handleChange('bike_type', value)
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
                  selected={editable.payment_status || ''}
                  onChange={value => {
                    this.handleChange('payment_status', value)
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
            {!isConnectManual(editable) && (
              <Col sm="6">
                <FormGroup>
                  <Label>Price Paid</Label>
                  <Input
                    type="text"
                    disabled
                    value={editable.price_paid}
                    name="price_paid"
                    onChange={({ target }) =>
                      this.handleChange(target.name, target.value)
                    }
                  />
                </FormGroup>
              </Col>
            )}
            {isFullLicence && (
              <Col sm="6">
                <InputSelectGroup
                  name="full_licence_type"
                  value={editable.full_licence_type}
                  label="Licence Type"
                  valueArray={FullLicenceTypes}
                  onChange={({ target }) => {
                    this.handleChange('full_licence_type', target.value)
                  }}
                  required
                />
              </Col>
            )}
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
          </Row>
          <Row>
            <Col sm="6">
              <Button
                disabled={isSending}
                color="link"
                outline
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
