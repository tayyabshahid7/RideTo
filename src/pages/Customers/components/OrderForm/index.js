import React from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import classnames from 'classnames'
import { getCustomerTypeShort } from 'services/customer'
import {
  ConnectInput,
  ConnectSelect,
  ConnectLabeledContent,
  Button
} from 'components/ConnectForm'

import {
  FullLicenceTypes,
  getTestResultOptions,
  getAvailableBikeHires
} from 'common/info'
import Loading from 'components/Loading'
import {
  getPaymentOptions,
  getTrainingStatusOptions,
  isRideTo,
  isConnectManual
} from 'services/order'
import styles from './OrderForm.scss'

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

    const { order } = props
    if (!order.customer) {
      order.customer = {}
    }
    if (!order.order) {
      order.order = {}
    }
    if (!order.order.completion_time) {
      order.order.completion_time = '00:00'
    }

    this.state = {
      editable: {
        application_reference_number: '',
        ...order
      },
      isChanged: false,
      isSending: false,
      showMore: false,
      inputsDisabled: true
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
    this.handleShowMore = this.handleShowMore.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.order !== this.props.order) {
      this.setState({
        editable: { ...this.props.order },
        isChanged: false
      })
    }
  }

  handleChange(typeName, value) {
    const { editable } = this.state
    const newOrder = { ...editable }

    let type = typeName.split('.')[0]
    let name = typeName.split('.')[1]

    if (!name) {
      newOrder[type] = value
    } else {
      newOrder[type][name] = value
    }

    this.setState({
      editable: newOrder,
      isChanged: true
    })
  }

  handleChangeRawEvent = event => {
    const { name, value } = event.target
    this.handleChange(name, value)
  }

  handleCancel() {
    this.setState({
      editable: { ...this.props.order },
      isChanged: false
    })
  }

  handleConfirmation() {
    const { editable } = this.state
    this.props.sendEmailConfirmation(editable.friendly_id)
  }
  handleShowMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  handleEditClick() {
    this.setState({
      inputsDisabled: false
    })
  }

  handleSaveClick() {
    const { onSave } = this.props
    const { editable } = this.state
    this.setState(
      {
        inputsDisabled: true
      },
      () => {
        onSave(editable)
      }
    )
  }

  getInstructors = schoolId => {
    const { instructors } = this.props

    return instructors.filter(x => x.supplier.includes(parseInt(schoolId)))
  }

  render() {
    const {
      suppliers,
      isSaving,
      info: { courseTypes },
      isSending,
      order,
      isAdmin
    } = this.props
    const { editable, isChanged, showMore, inputsDisabled } = this.state
    let course = order.school_course
    if (!course) {
      course = order
      if (course.supplier && typeof course.supplier === 'object') {
        course.supplier = course.supplier.id
      }
      course.course_type = course.selected_licence
    }

    const courses = courseTypes.filter(
      type =>
        type.schoolIds.includes(course.supplier) &&
        !['TFL_ONE_ON_ONE'].includes(type.constant)
    )

    if (courses.length) {
      course.course_type = courses.find(
        x => x.id === parseInt(course.course_type_id)
      )
    }

    if (!editable) {
      return null
    }

    const isFullLicence =
      editable.selected_licence &&
      editable.selected_licence.startsWith('FULL_LICENCE')

    const isCbt =
      editable.selected_licence === 'LICENCE_CBT_RENEWAL' ||
      editable.selected_licence === 'LICENCE_CBT'

    const isFullLicenceTest =
      editable.selected_licence &&
      editable.selected_licence.startsWith('FULL_LICENCE') &&
      editable.selected_licence.endsWith('TEST')

    const testResultOptions = getTestResultOptions()

    const trainingDate = moment(getDate(editable.training_date_time))

    const schoolInstructors = this.getInstructors(course.supplier)
    const instructorOptions = [
      { id: '', name: 'Un-Assigned' },
      ...schoolInstructors
    ]
    const instructorId = course.instructor

    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <h4 className={styles.title}>
            Order {getCustomerTypeShort(editable.source)} #
            {editable.friendly_id}
          </h4>
          {isAdmin && (
            <div className={styles.actions}>
              {inputsDisabled ? (
                <Button small color="link" onClick={this.handleEditClick}>
                  Edit
                </Button>
              ) : (
                <Button
                  small
                  color="primary"
                  onClick={this.handleSaveClick}
                  disabled={!isChanged}>
                  Save
                </Button>
              )}
            </div>
          )}
        </div>
        <Loading loading={isSaving}>
          <Row>
            <Col sm="4">
              <ConnectSelect
                label="Training Course"
                disabled={isRideTo(editable) || inputsDisabled}
                options={courses}
                valueField="constant"
                selected={editable.selected_licence || ''}
                name="selected_licence"
                onChange={value => {
                  this.handleChange('selected_licence', value)
                }}
              />
            </Col>
            <Col sm="4">
              <ConnectLabeledContent label="Training Date" disabled>
                <a
                  className={styles.trainingDateLink}
                  href={`/calendar/${trainingDate.format('YYYY-MM-DD')}`}>
                  {trainingDate.format('DD/MM/YYYY') || ''}
                </a>
              </ConnectLabeledContent>
            </Col>
            <Col sm="4">
              <ConnectInput
                disabled
                type="time"
                label="Training Time"
                name="training_date_time_time"
                value={getTime(editable.training_date_time) || ''}
              />
            </Col>
          </Row>
          <Row>
            <Col sm="4">
              <ConnectSelect
                disabled={inputsDisabled}
                label="Bike Hire"
                options={getAvailableBikeHires(
                  course,
                  this.props.order.bike_type
                )}
                selected={editable.bike_type}
                name="bike_type"
                onChange={value => {
                  this.handleChange('bike_type', value)
                }}
                valueField="value"
                labelField="title"
              />
            </Col>
            {isFullLicenceTest && (
              <Col sm="4">
                <ConnectSelect
                  disabled={inputsDisabled}
                  label="Test Result"
                  options={testResultOptions}
                  selected={editable.test_result}
                  name="test_result"
                  onChange={value => {
                    this.handleChange('test_result', value)
                  }}
                />
              </Col>
            )}
            <Col sm="4">
              <ConnectSelect
                disabled={inputsDisabled}
                label="Training Status"
                options={getTrainingStatusOptions()}
                selected={editable.training_status || ''}
                name="training_status"
                onChange={value => {
                  this.handleChange('training_status', value)
                }}
              />
            </Col>
            <Col sm="4">
              <ConnectSelect
                label="Payment Status"
                options={getPaymentOptions()}
                disabled={isRideTo(editable) || inputsDisabled}
                selected={editable.payment_status || ''}
                name="payment_status"
                onChange={value => {
                  this.handleChange('payment_status', value)
                }}
              />
            </Col>
          </Row>
          <div
            className={classnames(
              styles.extra,
              showMore && styles.extraVisible
            )}>
            <Row>
              {!isConnectManual(editable) && (
                <Col sm="4">
                  <ConnectInput
                    label="Price Paid"
                    type="text"
                    disabled
                    value={`£${parseFloat(editable.price_paid).toFixed(2)}`}
                    name="price_paid"
                  />
                </Col>
              )}
              <Col sm="4">
                <ConnectLabeledContent label="Stripe link" disabled>
                  <a
                    href={editable.stripe_charge_href}
                    target="_blank"
                    rel="noopener noreferrer">
                    Open
                  </a>
                </ConnectLabeledContent>
              </Col>

              <Col sm="4">
                <ConnectSelect
                  label="Training Site"
                  disabled={true || isRideTo(editable) || inputsDisabled}
                  options={suppliers}
                  selected={editable.training_location || ''}
                  name="supplier"
                  onChange={value => {
                    this.handleChange('supplier', parseInt(value, 10))
                  }}
                />
              </Col>

              {isFullLicence && (
                <Col sm="4">
                  <ConnectSelect
                    disabled={inputsDisabled}
                    name="full_licence_type"
                    value={editable.full_licence_type}
                    label="Licence Type"
                    options={FullLicenceTypes}
                    labelField="title"
                    valueField="value"
                    onChange={value => {
                      this.handleChange('full_licence_type', value)
                    }}
                    required
                  />
                </Col>
              )}

              <Col sm="4">
                <ConnectSelect
                  disabled={true}
                  label="Instructor"
                  options={instructorOptions}
                  selected={instructorId}
                  name="instructor_id"
                />
              </Col>
              {isCbt && (
                <Col sm="4">
                  <ConnectInput
                    disabled={inputsDisabled}
                    name="customer.cbt_certificate_number"
                    value={editable.customer.cbt_certificate_number}
                    label="Certificate number"
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
              )}
              <Col sm="4">
                <ConnectInput
                  disabled={inputsDisabled}
                  name="order.completion_date"
                  value={editable.order.completion_date}
                  label="Completion Date"
                  type="date"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
              <Col sm="4">
                <ConnectInput
                  disabled={inputsDisabled}
                  name="order.completion_time"
                  value={editable.order.completion_time}
                  label="Completion Time"
                  step="60"
                  type="time"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
              <Col sm="4">
                <ConnectInput
                  disabled={inputsDisabled}
                  name="order.course_duration"
                  value={editable.order.course_duration}
                  label="Course Duration"
                  type="number"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
              <Col sm="4">
                <ConnectInput
                  disabled={inputsDisabled}
                  name="order.instructor_certificate"
                  value={editable.order.instructor_certificate}
                  label="Instructor Certificate"
                  type="text"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
              <Col sm="4">
                <ConnectInput
                  disabled={inputsDisabled}
                  name="order.restriction"
                  value={editable.order.restriction}
                  label="Restriction"
                  type="text"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
            </Row>
            {editable.source !== 'RIDETO' &&
              editable.source !== 'RIDETO_INSTANT' && (
                <div className={styles.comms}>
                  <Button
                    disabled={isSending}
                    color="primary"
                    onClick={this.handleConfirmation}>
                    Send Confirmation
                  </Button>
                </div>
              )}
          </div>
          <div className={styles.showMore}>
            <button
              className={styles.showMoreButton}
              onClick={this.handleShowMore}>
              {showMore ? 'Show less' : 'Show more'}
            </button>
          </div>
        </Loading>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    instructors: state.instructor.instructors
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderForm)
