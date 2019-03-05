import React from 'react'
// import { Form, Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'
import { Form } from 'reactstrap'

import styles from './CustomerDetailForm.scss'
// import Checkbox from 'components/Checkbox'
// import InputTextGroup from 'components/Forms/InputTextGroup'
// import ConfirmModal from 'components/Modals/ConfirmModal'
// import AgeInput from 'components/AgeInput'
// import MinimalSelect from 'components/MinimalSelect'
import {
  isRideTo,
  getRidingExperienceOptions,
  getCurrentLicenceOptions,
  getBooleanSelectOptions
} from 'services/customer'
import {
  ConnectInput,
  ConnectSelect,
  ConnectAgeInput
} from 'components/ConnectForm'

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
    // const { showConfirmModal } = this.state
    // const { customer, onChange, onDelete, isDisabled, onCancel } = this.props
    const { customer, onChange } = this.props

    return (
      <Form className={styles.panel} onSubmit={this.handleSubmit}>
        {/*
        <Row>
          <Col>
            <InputTextGroup
              name="first_name"
              value={customer.first_name || ''}
              label="First Name"
              onChange={this.handleChange}
              required
            />
          </Col>
          <Col>
            <InputTextGroup
              name="last_name"
              value={customer.last_name || ''}
              label="Last Name"
              onChange={this.handleChange}
              required
            />
          </Col>
        </Row>
        */}
        <ConnectInput
          name="phone"
          value={customer.phone || ''}
          label="Phone"
          type="phone"
          onChange={this.handleChange}
        />
        <ConnectAgeInput
          name="birthdate"
          value={customer.birthdate || ''}
          label="Birth Date"
          onChange={this.handleChange}
        />
        <ConnectSelect
          label="Current Licence"
          name="current_licence"
          options={getCurrentLicenceOptions()}
          selected={customer.current_licence || ''}
          onChange={value => onChange({ ...customer, current_licence: value })}
        />
        <ConnectInput
          name="licence_number"
          value={customer.licence_number || ''}
          label="Licence Number"
          type="text"
          onChange={this.handleChange}
        />
        <ConnectInput
          name="national_insurance_number"
          value={customer.national_insurance_number || ''}
          label="National Insurance"
          type="text"
          onChange={this.handleChange}
        />
        <ConnectSelect
          label="Riding Experience"
          name="riding_experience"
          options={getRidingExperienceOptions()}
          selected={customer.riding_experience || ''}
          onChange={value =>
            onChange({ ...customer, riding_experience: value })
          }
        />
        {isRideTo(customer) ? (
          <ConnectInput
            name="rideto_email"
            value=""
            label="Email"
            type="email"
            disabled
          />
        ) : (
          <ConnectInput
            name="rideto_email"
            value={customer.rideto_email || ''}
            label="Email"
            type="email"
            required
            onChange={this.handleChange}
          />
        )}
        <ConnectInput
          name="cbt_passed_date"
          value={customer.cbt_passed_date || ''}
          label="CBT Passed Date"
          type="date"
          onChange={this.handleChange}
        />
        <ConnectInput
          name="theory_test_number"
          value={customer.theory_test_number || ''}
          label="Theory Test Number"
          type="text"
          onChange={this.handleChange}
        />
        <ConnectSelect
          label="Email opt in"
          name="email_optin"
          options={getBooleanSelectOptions()}
          selected={
            (customer.email_optin && customer.email_optin.toString()) || ''
          }
          onChange={value =>
            onChange({ ...customer, email_optin: value === 'true' })
          }
        />

        {/*
        <FormGroup>
          <Label>Notes</Label>
          <Input
            type="textarea"
            name="notes"
            value={customer.notes || ''}
            onChange={this.handleChange}
          />
        </FormGroup>
        {['WIDGET', 'DASHBOARD'].includes(customer.source) && (
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
        <div>
          <Button type="submit" color="primary" disabled={isDisabled}>
            Save
          </Button>
          <Button color="link" onClick={onCancel} disabled={isDisabled}>
            Cancel
          </Button>
        </div>
        */}
      </Form>
    )
  }
}

export default CustomerDetailForm
