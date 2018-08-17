import React from 'react'
import moment from 'moment'

import LabelField from 'pages/Widget/components/LabelField'
import DateInput from 'components/DateInput'
import MinimalSelect from 'components/MinimalSelect'
import styles from './CustomerDetailsForm.scss'

const BIRTHDATE_ERROR = 'Please enter valid date'
const RIDING_EXPERIENCE = [
  'Cycling',
  'Off road motorcycling',
  'On road motorcycling'
].map(opt => {
  return { name: opt, id: opt }
})

const CURRENT_LICENCES = [
  {
    id: 'CURRENT_LICENCES_PROVISIONAL_LICENCE',
    name: 'UK Provisional Licence'
  },
  {
    id: 'CURRENT_LICENCES_DRIVING_LICENCE',
    name: 'UK Driving Licence'
  },
  {
    id: 'CURRENT_LICENCES_CBT',
    name: 'CBT Certificate'
  },
  {
    id: 'CURRENT_LICENCES_FULL_EU_DRIVING_LICENCE',
    name: 'EU Licence (with UK counterpart licence number)'
  }
]

const handleChange = (event, details, errors, onChange) => {
  const { id, value } = event.target
  console.log('handleChange', id, value)
  onChange({ ...details, [id]: value }, { ...errors, [id]: null })
}

const CustomerDetailsForm = ({ details, errors, onChange }) => {
  const labelStyle = {
    marginTop: '16px',
    marginBottom: '16px'
  }
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
        style={labelStyle}>
        <MinimalSelect
          options={CURRENT_LICENCES}
          selected={details.current_licence}
          onChange={value => {
            onChange({ ...details, current_licence: value }, errors)
          }}
        />
      </LabelField>

      <LabelField
        label="Riding Experience"
        name="riding_experience"
        style={labelStyle}>
        <MinimalSelect
          options={RIDING_EXPERIENCE}
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
