import React from 'react'
import styles from './styles.scss'
import { Button, Row, Col, Form } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { BikeHires } from 'common/info'
import Loading from 'components/Loading'

class AddOrderItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: {
        school_course_id: this.props.course.id,
        user_birthdate: '',
        user_driving_licence_number: '',
        user_email: '',
        user_first_name: '',
        user_last_name: '',
        user_phone: '',
        bike_hire: '',
        payment_status: '',
        riding_experience: '',
        start_time: ''
      }
    }
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
    console.log('HALA handleSave', order)
    let response = await onSave(order)
    console.log('HALA Response', response)
    if (response) {
      // Then Success
      onCancel()
    }
  }

  render() {
    let { onCancel, info, saving } = this.props
    const {
      user_first_name,
      user_last_name,
      user_phone,
      bike_hire,
      riding_experience,
      payment_status,
      user_birthdate,
      user_driving_licence_number,
      user_email
    } = this.state

    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <InputTextGroup
                  name="user_first_name"
                  value={user_first_name}
                  label="First Name"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
              <Col>
                <InputTextGroup
                  name="user_last_name"
                  value={user_last_name}
                  label="Surname"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup
                  name="user_phone"
                  value={user_phone}
                  label="Mobile"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
              <Col>
                <InputTextGroup
                  name="user_email"
                  value={user_email}
                  label="Email"
                  className="form-group"
                  type="email"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputTextGroup
                  name="user_birthdate"
                  value={user_birthdate}
                  label="Birthdate"
                  className="form-group"
                  type="date"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                  required
                />
              </Col>
              <Col />
            </Row>
            <Row>
              <Col>
                <InputTextGroup
                  name="user_driving_licence_number"
                  value={user_driving_licence_number}
                  label="License"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
              <Col>
                <InputSelectGroup
                  name="payment_status"
                  value={payment_status}
                  label="Payment Status"
                  valueArray={info.paymentStatus}
                  noSelectOption
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputSelectGroup
                  name="riding_experience"
                  value={riding_experience}
                  label="Riding Experience"
                  valueArray={info.ridingExperiences}
                  noSelectOption
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
              <Col>
                <InputSelectGroup
                  name="bike_hire"
                  value={bike_hire}
                  label="Bike Hire"
                  valueArray={BikeHires}
                  noSelectOption
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col className="mt-3 text-right">
                <Button type="submit" color="primary" className="mr-2">
                  Save
                </Button>
                <Button color="" onClick={onCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Loading>
      </div>
    )
  }
}

export default AddOrderItem
