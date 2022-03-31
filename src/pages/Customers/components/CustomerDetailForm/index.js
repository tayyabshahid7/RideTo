import {
  Button,
  ConnectAgeInput,
  ConnectInput,
  ConnectSelect
} from 'components/ConnectForm'
import {
  getBooleanSelectOptions,
  getCurrentLicenceOptions,
  getRidingExperienceOptions,
  isRideTo
} from 'services/customer'

import { Form } from 'reactstrap'
import React from 'react'
import classnames from 'classnames'
import { find } from 'lodash'
import isMobile from 'is-mobile'
import styles from './CustomerDetailForm.scss'

class CustomerDetailForm extends React.Component {
  handleChange = ({ target }) => {
    const { customer, onChange } = this.props
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    onChange({ ...customer, [name]: value })
  }

  handleSubmit = event => {
    const { onSave } = this.props
    event.preventDefault()
    onSave()
  }

  render() {
    const { customer, onChange, isDisabled, onCancel, isAdmin } = this.props
    let currentDriversLicence = find(
      getCurrentLicenceOptions(),
      option => option.id === customer.current_licence
    )
    return (
      <Form className={styles.panel} onSubmit={this.handleSubmit}>
        <ConnectInput
          name="first_name"
          value={customer.first_name || ''}
          label="First Name"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="last_name"
          value={customer.last_name || ''}
          label="Last Name"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <div className={styles.phoneInput}>
          <ConnectInput
            name="phone"
            value={customer.phone || ''}
            label="Phone"
            type="phone"
            onChange={this.handleChange}
            disabled={!isAdmin}
          />
          {isMobile() && customer.phone && (
            <a className={styles.callButton} href={`tel:${customer.phone}`}>
              Call
            </a>
          )}
        </div>
        <div className={styles.phoneInput}>
          <ConnectInput
            name="alternative_phone"
            value={customer.alternative_phone || ''}
            label="Alternative Phone Number"
            type="phone"
            onChange={this.handleChange}
            disabled={!isAdmin}
          />
          {isMobile() && customer.alternative_phone && (
            <a
              className={styles.callButton}
              href={`tel:${customer.alternative_phone}`}>
              Call
            </a>
          )}
        </div>
        <ConnectAgeInput
          name="birthdate"
          value={customer.birthdate || ''}
          label="Birth Date"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectSelect
          textStyle
          label="Current Licence"
          name="current_licence"
          options={getCurrentLicenceOptions().concat({ id: '', name: '' })}
          selected={currentDriversLicence ? currentDriversLicence.id : ''}
          onChange={value => onChange({ ...customer, current_licence: value })}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="licence_number"
          value={customer.licence_number || ''}
          label="Driver Number"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="national_insurance_number"
          value={customer.national_insurance_number || ''}
          label="National Insurance"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
            disabled={!isAdmin}
          />
        )}
        <ConnectInput
          name="address"
          value={customer.address || ''}
          label="Address"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="address_2"
          value={customer.address_2 || ''}
          label="Address 2"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="postcode"
          value={customer.postcode || ''}
          label="Postcode"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="town"
          value={customer.town || ''}
          label="Town"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="country"
          value={customer.country || ''}
          label="Country"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="county"
          value={customer.county || ''}
          label="County"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="cbt_certificate_number"
          value={customer.cbt_certificate_number || ''}
          label="CBT Certificate Number"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="cbt_passed_date"
          value={customer.cbt_passed_date || ''}
          label="CBT Passed Date"
          type="date"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectInput
          name="theory_test_number"
          value={customer.theory_test_number || ''}
          label="Theory Test Number"
          type="text"
          onChange={this.handleChange}
          disabled={!isAdmin}
        />
        <ConnectSelect
          textStyle
          label="T&Cs Agreed"
          name="tandcs_agreed"
          options={getBooleanSelectOptions()}
          selected={
            (customer.tandcs_agreed && customer.tandcs_agreed.toString()) || ''
          }
          onChange={value =>
            onChange({ ...customer, tandcs_agreed: value === 'true' })
          }
          disabled={!isAdmin}
        />
        <ConnectSelect
          textStyle
          label="Email Opt In"
          name="email_optin"
          options={getBooleanSelectOptions()}
          selected={
            (customer.email_optin && customer.email_optin.toString()) || ''
          }
          onChange={value =>
            onChange({ ...customer, email_optin: value === 'true' })
          }
          disabled={!isAdmin}
        />
        <ConnectSelect
          textStyle
          label="Third Party Opt In"
          name="third_party_optin"
          options={getBooleanSelectOptions()}
          selected={
            (customer.third_party_optin &&
              customer.third_party_optin.toString()) ||
            ''
          }
          onChange={value =>
            onChange({ ...customer, third_party_optin: value === 'true' })
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
