import React from 'react'
import { Form } from 'reactstrap'

import styles from './CustomerDetailForm.scss'
import {
  isRideTo,
  getRidingExperienceOptions,
  getCurrentLicenceOptions,
  getBooleanSelectOptions
} from 'services/customer'
import {
  ConnectInput,
  ConnectSelect,
  ConnectAgeInput,
  Button
} from 'components/ConnectForm'
import classnames from 'classnames'

class CustomerDetailForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange({ target }) {
    const { customer, onChange } = this.props
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    onChange({ ...customer, [name]: value })
  }

  handleSubmit(event) {
    const { onSave } = this.props
    event.preventDefault()
    onSave()
  }

  render() {
    const { customer, onChange, isDisabled, onCancel } = this.props

    return (
      <Form className={styles.panel} onSubmit={this.handleSubmit}>
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
          textStyle
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
          textStyle
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
          textStyle
          label="T&Cs agreed"
          name="tandc_agree"
          options={getBooleanSelectOptions()}
          selected={
            (customer.tandc_agree && customer.tandc_agree.toString()) || ''
          }
          onChange={value =>
            onChange({ ...customer, tandc_agree: value === 'true' })
          }
        />
        <ConnectSelect
          textStyle
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
        <div
          className={classnames(
            styles.saveBar,
            !isDisabled && styles.showSaveBar
          )}>
          <Button type="submit" color="primary" disabled={isDisabled}>
            Save
          </Button>
          <Button color="white" onClick={onCancel} disabled={isDisabled}>
            Cancel
          </Button>
        </div>
      </Form>
    )
  }
}

export default CustomerDetailForm
