import React from 'react'
import styles from './styles.scss'
import { Button, Row, Col, Form } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { BikeHires, FullLicenceTypes } from 'common/info'
import { getPaymentOptions } from 'services/order'
import { checkCustomerExists } from 'services/customer'

class AddOrderItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: {
        school_course: this.props.course.id,
        user_birthdate: '',
        user_driving_licence_number: '',
        user_email: '',
        user_first_name: '',
        user_last_name: '',
        user_phone: '',
        bike_hire: '',
        payment_status: '',
        riding_experience: '',
        full_licence_type: '',
        start_time: `${this.props.course.date}T${this.props.course.time}Z`
      },
      isFullLicence: this.props.course.course_type.constant.startsWith(
        'FULL_LICENCE'
      )
    }

    this.scrollIntoView = React.createRef()
  }

  componentDidMount() {
    this.scrollIntoView.current.scrollIntoView()
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { order } = this.state
    order[name] = event.target.value
    this.setState({ order })
  }

  async handleSave(event) {
    const { onSave, onCancel } = this.props
    const { order } = this.state
    event.preventDefault()

    let result = await checkCustomerExists(order.user_email)

    if (result.email_exists) {
      const confirm = window.confirm(
        `There's already a customer with this email (${order.user_email})\n` +
          'The order will be associated to this email.\n' +
          'Do you want to continue?'
      )
      if (!confirm) return
    }

    let response = await onSave(order)
    if (response) {
      // Then Success
      onCancel()
    }
  }

  render() {
    let { onCancel, info } = this.props
    const {
      user_first_name,
      user_last_name,
      user_phone,
      bike_hire,
      riding_experience,
      payment_status,
      user_birthdate,
      user_driving_licence_number,
      user_email,
      full_licence_type,
      isFullLicence
    } = this.state

    return (
      <div className={styles.container}>
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave.bind(this)}>
          <div ref={this.scrollIntoView} />
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_first_name"
                value={user_first_name}
                label="First Name *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
            <Col sm="6">
              <InputTextGroup
                name="user_last_name"
                value={user_last_name}
                label="Surname *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_phone"
                value={user_phone}
                label="Mobile"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
              />
            </Col>
            <Col sm="6">
              <InputTextGroup
                name="user_email"
                value={user_email}
                label="Email *"
                className="form-group"
                type="email"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_birthdate"
                value={user_birthdate}
                label="Birthdate *"
                className="form-group"
                type="date"
                onChange={this.handleChangeRawEvent.bind(this)}
                // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                required
              />
            </Col>
            <Col sm="6">
              {isFullLicence && (
                <InputSelectGroup
                  name="full_licence_type"
                  value={full_licence_type}
                  label="Licence Type *"
                  valueArray={FullLicenceTypes}
                  noSelectOption
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_driving_licence_number"
                value={user_driving_licence_number}
                label="License Number"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
              />
            </Col>
            <Col sm="6">
              <InputSelectGroup
                name="payment_status"
                value={payment_status}
                label="Payment Status *"
                valueArray={getPaymentOptions()}
                noSelectOption
                onChange={this.handleChangeRawEvent.bind(this)}
                required
                valueField="id"
                titleField="name"
              />
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputSelectGroup
                name="riding_experience"
                value={riding_experience}
                label="Riding Experience"
                valueArray={info.ridingExperiences}
                noSelectOption
                onChange={this.handleChangeRawEvent.bind(this)}
              />
            </Col>
            <Col sm="6">
              <InputSelectGroup
                name="bike_hire"
                value={bike_hire}
                label="Bike Hire *"
                valueArray={BikeHires}
                noSelectOption
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-3 text-right">
              <Button type="button" color="primary" className="mr-2">
                Payment
              </Button>
              <Button type="submit" color="primary" className="mr-2">
                Save
              </Button>
              <Button color="" onClick={onCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
        {/* </Loading> */}
      </div>
    )
  }
}

export default AddOrderItem
