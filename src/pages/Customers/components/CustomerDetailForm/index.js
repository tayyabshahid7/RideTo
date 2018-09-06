import React from 'react'
import { Form, Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'

import styles from './CustomerDetailForm.scss'
import Checkbox from 'components/Checkbox'
import InputTextGroup from 'components/Forms/InputTextGroup'
import ConfirmModal from 'components/Modals/ConfirmModal'
import AgeInput from 'components/AgeInput'
import MinimalSelect from 'components/MinimalSelect'
import {
  getRidingExperienceOptions,
  getCurrentLicenceOptions
} from 'services/customer'

class CustomerDetailForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showConfirmModal: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleToggleModal = this.handleToggleModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange({ target }) {
    const { customer, onChange } = this.props
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    onChange({ ...customer, [name]: value })
  }

  handleToggleModal() {
    this.setState({ showConfirmModal: !this.state.showConfirmModal })
  }

  handleSubmit(event) {
    const { onSave } = this.props
    event.preventDefault()
    onSave()
  }

  render() {
    const { showConfirmModal } = this.state
    const { customer, onChange, onDelete, isDisabled, onCancel } = this.props
    const { orders = [] } = customer

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <InputTextGroup
              name="first_name"
              value={customer.first_name || ''}
              label="First Name"
              className="form-group"
              onChange={this.handleChange}
              required
            />
          </Col>
          <Col>
            <InputTextGroup
              name="last_name"
              value={customer.last_name || ''}
              label="Last Name"
              className="form-group"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="phone"
              value={customer.phone || ''}
              label="Phone"
              className="form-group"
              type="phone"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <FormGroup>
              <Label>Birth Date</Label>
              <AgeInput
                name="birthdate"
                value={customer.birthdate || ''}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <FormGroup>
              <Label for="current_licence">Current Licence</Label>
              <MinimalSelect
                className={styles.select}
                options={getCurrentLicenceOptions()}
                selected={customer.current_licence || ''}
                onChange={value =>
                  onChange({ ...customer, current_licence: value })
                }
              />
            </FormGroup>
          </Col>
          <Col sm="6">
            <InputTextGroup
              name="licence_number"
              value={customer.licence_number || ''}
              label="Licence Number"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="national_insurance_number"
              value={customer.national_insurance_number || ''}
              label="National Insurance"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="current_licence">Riding Experience</Label>
              <MinimalSelect
                className={styles.select}
                options={getRidingExperienceOptions()}
                selected={customer.riding_experience || ''}
                onChange={value =>
                  onChange({ ...customer, riding_experience: value })
                }
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="email"
              value={customer.email || ''}
              label="Email"
              className="form-group"
              type="email"
              required
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup
              name="cbt_passed_date"
              value={customer.cbt_passed_date || ''}
              label="CBT Passed Date"
              className="form-group"
              type="date"
              onChange={this.handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="form-group">
              <Label for="email_optin">Email Opt-In</Label>
              <Checkbox
                id="email_optin"
                name="email_optin"
                checked={customer.email_optin || false}
                onChange={this.handleChange}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label>Notes</Label>
              <Input
                type="textarea"
                name="notes"
                value={customer.notes || ''}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            {orders.length === 0 && (
              <React.Fragment>
                <Button color="danger" onClick={this.handleToggleModal}>
                  Remove Customer
                </Button>

                <ConfirmModal
                  onClose={this.handleToggleModal}
                  showModal={showConfirmModal}
                  onDelete={onDelete}
                  message={`Are you sure to remove this customer?`}
                />
              </React.Fragment>
            )}
          </Col>
          <Col sm="6" className={styles.actions}>
            <Button type="submit" color="primary" disabled={isDisabled}>
              Save
            </Button>
            <Button color="link" onClick={onCancel} disabled={isDisabled}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default CustomerDetailForm
