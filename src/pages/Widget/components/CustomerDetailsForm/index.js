import React from 'react'
import moment from 'moment'

import LabelField from 'pages/Widget/components/LabelField'
import DateInput from 'components/DateInput'
import MinimalSelect from 'components/MinimalSelect'
import {
  getRidingExperienceOptions,
  getCurrentLicenceOptions
} from 'services/customer'
import styles from './CustomerDetailsForm.scss'

const BIRTHDATE_ERROR =
  'Please enter the date in the format DD/MM/YYYY. You MUST be at least 16 years old on the selected training date.'

const handleChange = (event, details, errors, onChange) => {
  const { id, value } = event.target
  onChange({ ...details, [id]: value }, { ...errors, [id]: null })
}

const CustomerDetailsForm = ({ details, errors, onChange }) => {
  const labelStyle = {
    marginTop: '16px',
    marginBottom: '16px'
  }

  const emptyOption = {
    id: null,
    name: 'Select...'
  }
  const currentLicenceOptions = [emptyOption].concat(getCurrentLicenceOptions())
  const ridingExperienceOptions = [emptyOption].concat(
    getRidingExperienceOptions()
  )

  return (
    <div className={styles.customerDetailsForm}>
      <LabelField
        label="First Name"
        name="first_name"
        style={labelStyle}
        error={errors.first_name}>
        <input
          id="first_name"
          type="text"
          value={details.first_name || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>

      <LabelField
        label="Surname"
        name="last_name"
        error={errors.last_name}
        style={labelStyle}>
        <input
          id="last_name"
          type="text"
          value={details.last_name || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>

      <LabelField
        label="Date of Birth"
        name="user_birthdate"
        error={errors.user_birthdate}
        style={labelStyle}>
        <DateInput
          id="user_birthdate"
          minYears={16}
          today={moment()}
          value={details.user_birthdate || ''}
          onChange={(id, value) => {
            onChange({ ...details, [id]: value }, { ...errors, [id]: null })
          }}
          onError={id => {
            onChange(details, { ...errors, [id]: BIRTHDATE_ERROR })
          }}
        />
      </LabelField>

      <LabelField
        label="Phone"
        name="phone"
        error={errors.phone}
        style={labelStyle}>
        <input
          id="phone"
          type="text"
          value={details.phone || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>

      <LabelField
        label="Email"
        name="email"
        error={errors.email}
        style={labelStyle}>
        <input
          id="email"
          type="email"
          value={details.email || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>

      <LabelField
        label="Current Licence"
        name="current_licence"
        style={labelStyle}
        error={errors.current_licence}>
        <MinimalSelect
          options={currentLicenceOptions}
          selected={details.current_licence}
          onChange={value => {
            onChange({ ...details, current_licence: value }, errors)
          }}
        />
      </LabelField>

      <LabelField
        label="Riding Experience"
        name="riding_experience"
        style={labelStyle}
        error={errors.riding_experience}>
        <MinimalSelect
          options={ridingExperienceOptions}
          selected={details.riding_experience}
          onChange={value => {
            onChange({ ...details, riding_experience: value }, errors)
          }}
        />
      </LabelField>
    </div>
  )
}

export default CustomerDetailsForm