import React from 'react'
import styles from './styles.scss'
import { Button, Row, Col, Form, FormGroup, Label } from 'reactstrap'
import AgeInput from 'components/AgeInput'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { BikeHires, formatBikeConstant, FullLicenceTypes } from 'common/info'
import { getPaymentOptions } from 'services/order'
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
      showChangeDate: false
    }

    this.handleSave = this.handleSave.bind(this)
    this.handleChangeRawEvent = this.handleChangeRawEvent.bind(this)
    this.handleToggleDateClick = this.handleToggleDateClick.bind(this)
  }

  handleChangeRawEvent(event) {
    let type = event.target.name.split('.')[0]
    let name = event.target.name.split('.')[1]
    let { order } = this.state

    if (!name) {
      order[type] = event.target.value
    } else {
      order[type][name] = event.target.value
    }

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
    let {
      onCancel,
      info,
      courses,
      date,
      time,
      onSave,
      loadTimes,
      times
    } = this.props
    const { showChangeDate } = this.state

    if (!this.state.order.order || !this.state.order.customer) {
      return null
    }

    const {
      first_name,
      last_name,
      phone,
      email,
      birthdate,
      licence_number,
      riding_experience
    } = this.state.order.customer

    const { direct_friendly_id, payment_status } = this.state.order.order

    const { bike_type, full_licence_type } = this.state.order

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
                  courses={courses}
                  onSave={onSave}
                  onCancel={this.handleToggleDateClick}
                  times={times}
                  loadTimes={loadTimes}
                />
              )}
            </Col>
          </Row>
          {!showChangeDate && (
            <div>
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="customer.first_name"
                    value={first_name}
                    label="First Name *"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent}
                    required
                  />
                </Col>
                <Col sm="6">
                  <InputTextGroup
                    name="customer.last_name"
                    value={last_name}
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
                    name="customer.phone"
                    value={phone}
                    label="Mobile"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
                <Col sm="6">
                  <InputTextGroup
                    name="customer.email"
                    value={email}
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
                      name="customer.birthdate"
                      value={birthdate}
                      onChange={this.handleChangeRawEvent}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {full_licence_type && (
                <Row>
                  <Col sm="6">
                    <FormGroup>
                      <InputSelectGroup
                        name="full_licence_type"
                        value={full_licence_type}
                        label="Licence Type *"
                        valueArray={FullLicenceTypes}
                        onChange={this.handleChangeRawEvent}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="customer.licence_number"
                    value={licence_number}
                    label="License"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
                <Col sm="6">
                  <InputSelectGroup
                    name="order.payment_status"
                    value={payment_status}
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
                    name="customer.riding_experience"
                    value={riding_experience}
                    label="Riding Experience"
                    valueArray={info.ridingExperiences}
                    noSelectOption
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
                <Col sm="6">
                  <InputSelectGroup
                    name="bike_type"
                    value={bike_type}
                    label="Bike Hire"
                    valueArray={BikeHires}
                    noSelectOption
                    onChange={this.handleChangeRawEvent}
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
            </div>
          )}
        </Form>
        {/* </Loading> */}
      </div>
    )
  }
}

export default EditOrderForm
