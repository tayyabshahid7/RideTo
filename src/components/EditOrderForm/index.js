import React from 'react'
import styles from './styles.scss'
import { Button, Row, Col, Form, FormGroup, Label } from 'reactstrap'
import AgeInput from 'components/AgeInput'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { BikeHires } from 'common/info'
import { getPaymentOptions } from 'services/order'
import ChangeDate from './ChangeDate/'

class EditOrderForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: props.order ? props.order : {},
      showChangeDate: false
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleChangeRawEvent = this.handleChangeRawEvent.bind(this)
    this.handleToggleDateClick = this.handleToggleDateClick.bind(this)
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
    let { onCancel, info, times, date, time, onSave } = this.props
    const { showChangeDate } = this.state
    const {
      user_first_name,
      user_last_name,
      user_phone,
      bike_hire,
      riding_experience,
      status, //payment status
      user_birthdate,
      user_driving_licence_number,
      user_email,
      direct_friendly_id
    } = this.state.order

    return (
      <div className={styles.container}>
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave}>
          <Row>
            <Col>
              <div className={styles.header}>
                <h4>EDIT {direct_friendly_id}</h4>
                <Button
                  type="button"
                  color={showChangeDate ? '' : 'primary'}
                  onClick={this.handleToggleDateClick}
                  className={styles.toggleButton}>
                  {showChangeDate ? 'Cancel' : 'Change Training Date'}
                </Button>
              </div>
              {showChangeDate && (
                <ChangeDate
                  date={date}
                  time={time}
                  times={times}
                  onSave={onSave}
                  onCancel={this.handleToggleDateClick}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_first_name"
                value={user_first_name}
                label="First Name *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
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
                onChange={this.handleChangeRawEvent}
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
                onChange={this.handleChangeRawEvent}
              />
            </Col>
            <Col sm="6">
              <InputTextGroup
                name="user_email"
                value={user_email}
                label="Email *"
                className="form-group"
                type="email"
                onChange={this.handleChangeRawEvent}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label>Birth Date *</Label>
                <AgeInput
                  name="user_birthdate"
                  value={user_birthdate}
                  onChange={this.handleChangeRawEvent}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <InputTextGroup
                name="user_driving_licence_number"
                value={user_driving_licence_number}
                label="License"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
              />
            </Col>
            <Col sm="6">
              <InputSelectGroup
                name="status"
                value={status}
                label="Payment Status"
                valueArray={getPaymentOptions()}
                noSelectOption
                onChange={this.handleChangeRawEvent}
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
                onChange={this.handleChangeRawEvent}
              />
            </Col>
            <Col sm="6">
              <InputSelectGroup
                name="bike_hire"
                value={bike_hire}
                label="Bike Hire"
                valueArray={BikeHires}
                noSelectOption
                onChange={this.handleChangeRawEvent}
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
        {/* </Loading> */}
      </div>
    )
  }
}

export default EditOrderForm
