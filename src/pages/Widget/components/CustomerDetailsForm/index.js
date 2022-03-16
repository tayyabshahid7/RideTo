import {
  getCurrentLicenceOptions,
  getRidingExperienceOptions
} from 'services/customer'

import DateInput from 'components/DateInput'
import LabelField from 'pages/Widget/components/LabelField'
import LicenceInput from 'components/RideTo/LicenceInput'
import MinimalSelect from 'components/MinimalSelect'
import React from 'react'
import { getLicenceAge } from 'services/course'
import moment from 'moment'
import styles from './CustomerDetailsForm.scss'

const handleChange = (event, details, errors, onChange) => {
  const { id, value } = event.target
  onChange({ ...details, [id]: value }, { ...errors, [id]: null })
}

const CustomerDetailsForm = ({
  details,
  errors,
  onChange,
  trainingDate,
  fullLicenceType,
  isRenewal,
  bikeType,
  courseType: { constant },
  requirePreviousCBTDate = true
}) => {
  const isManual = bikeType === 'manual'
  const isCBT = constant === 'LICENCE_CBT'
  const minAge = isManual ? 17 : 16
  let bdayError = `Please enter the date in the format DD/MM/YYYY. You MUST be at least ${
    !fullLicenceType ? minAge : getLicenceAge(fullLicenceType)
  } years old on the selected training date.`

  if (isManual && isCBT) {
    bdayError =
      'In order to take your CBT on a 125cc motorcycle, you must be 17 years old on the day of the course'
  }
  const pastCbtError = (
    <>
      Your CBT has passed the renewal date, please book the CBT Training course
      instead.
    </>
  )

  const labelStyle = {
    marginTop: '16px',
    marginBottom: '16px'
  }

  const currentLicenceOptions = getCurrentLicenceOptions()
  const ridingExperienceOptions = getRidingExperienceOptions()

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
          trainingDate={trainingDate}
          id="user_birthdate"
          minYears={minAge}
          maxYears={100}
          today={moment()}
          value={details.user_birthdate || ''}
          onChange={(id, value) => {
            onChange({ ...details, [id]: value }, { ...errors, [id]: null })
          }}
          onError={id => {
            onChange(details, { ...errors, [id]: bdayError })
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
          maxLength="15"
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

      {isRenewal && requirePreviousCBTDate && (
        <LabelField
          label="Previous CBT Completion Date"
          name="prev_cbt_date"
          error={errors.prev_cbt_date}
          style={labelStyle}>
          <DateInput
            trainingDate={trainingDate}
            id="prev_cbt_date"
            isPrevCbt
            value={details.prev_cbt_date || ''}
            onChange={(id, value) => {
              onChange({ ...details, [id]: value }, { ...errors, [id]: null })
            }}
            onError={(id, reason) => {
              let errorTxt = pastCbtError
              if (reason === 'invalid') {
                errorTxt = 'This field is required.'
              } else if (reason === 'future') {
                errorTxt = 'Please input valid date.'
              }

              onChange(details, { ...errors, [id]: errorTxt })
            }}
          />
        </LabelField>
      )}

      <LabelField
        label="Current Licence"
        name="current_licence"
        style={labelStyle}
        error={errors.current_licence}>
        <MinimalSelect
          placeholder
          options={currentLicenceOptions}
          selected={details.current_licence}
          onChange={value => {
            onChange({ ...details, current_licence: value }, errors)
          }}
        />
      </LabelField>

      <LabelField
        label="Driving Licence Number"
        name="driving_licence_number"
        style={labelStyle}
        error={errors.driving_licence_number}>
        <LicenceInput
          placeholder="_____ ______ __ _ __"
          name="driving_licence_number"
          id="driving_licence_number"
          value={details.driving_licence_number}
          style={{ width: 'auto' }}
          onChange={event => {
            if (errors.driving_licence_number) {
              const drivingLicenceRegex = /^^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$$/
              if (
                drivingLicenceRegex.test(
                  event.target.value
                    .split(' ')
                    .join('')
                    .toUpperCase()
                )
              ) {
                delete errors.driving_licence_number
              }
            }
            onChange(
              { ...details, driving_licence_number: event.target.value },
              errors
            )
          }}
        />
      </LabelField>

      <LabelField
        label="Riding Experience"
        name="riding_experience"
        style={labelStyle}
        error={errors.riding_experience}>
        <MinimalSelect
          placeholder
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
