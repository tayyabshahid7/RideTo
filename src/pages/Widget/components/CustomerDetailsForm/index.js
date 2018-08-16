import React from 'react'

import LabelField from 'pages/Widget/components/LabelField'
import styles from './CustomerDetailsForm.scss'

const handleChange = (event, details, errors, onChange) => {
  const { id, value } = event.target
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
        <input
          id="user_birthdate"
          type="text"
          placeholder="DD/MM/YYYY"
          value={details.user_birthdate || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
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
        <input
          id="current_licence"
          value={details.current_licence || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>

      <LabelField
        label="Riding Experience"
        name="riding_experience"
        style={labelStyle}>
        <input
          id="riding_experience"
          value={details.riding_experience || ''}
          onChange={event => handleChange(event, details, errors, onChange)}
        />
      </LabelField>
    </div>
  )
}

export default CustomerDetailsForm
