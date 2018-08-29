import React from 'react'
import { Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'

import InputTextGroup from 'components/Forms/InputTextGroup'
import MinimalSelect from 'components/MinimalSelect'
import {
  getBikeHireOptions,
  getPaymentOptions,
  getTrainingStatusOptions
} from 'services/order'
import styles from './OrderForm.scss'

const BIKE_HIRE_OPTIONS = Object.keys(getBikeHireOptions()).map(id => {
  return {
    id,
    name: getBikeHireOptions()[id]
  }
})

class OrderForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.order
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange({ target }) {
    const { editable } = this.state
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState({ editable: { ...editable, [name]: value } })
  }

  render() {
    const { suppliers } = this.props
    const { editable } = this.state
    const selectedSupplier = suppliers.find(
      ({ id }) => id === editable.supplier
    )
    const courses = selectedSupplier ? selectedSupplier.courses : []

    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Label>Training Site</Label>
              <MinimalSelect
                className={styles.select}
                options={suppliers}
                selected={editable.supplier || ''}
                onChange={supplier => {
                  this.setState({
                    editable: {
                      ...editable,
                      supplier: parseInt(supplier, 10)
                    }
                  })
                }}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>Training</Label>
              <MinimalSelect
                className={styles.select}
                options={courses}
                valueField="constant"
                selected={editable.selected_licence || ''}
                onChange={selected_licence => {
                  this.setState({ editable: { ...editable, selected_licence } })
                }}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="start_time"
              value={editable.start_time || ''}
              label="Training Date"
              className="form-group"
              type="date"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <FormGroup>
              <Label>Bike Hire</Label>
              <MinimalSelect
                className={styles.select}
                options={BIKE_HIRE_OPTIONS}
                selected={editable.bike_hire || ''}
                onChange={bike_hire => {
                  this.setState({ editable: { ...editable, bike_hire } })
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
                selected={editable.status || ''}
                onChange={status => {
                  this.setState({ editable: { ...editable, status } })
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
                onChange={training_status => {
                  this.setState({ editable: { ...editable, training_status } })
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
                value={editable.payout}
                name="payout"
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
    )
  }
}

export default OrderForm
