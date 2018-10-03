import React from 'react'
import { RidingExperiences, RiderTypes } from 'common/info'
import Input from 'components/RideTo/Input'
import Select from 'components/RideTo/Select'
import AddressForm from 'components/AddressForm'
import styles from './styles.scss'
import { getCurrentLicenceOptions } from 'services/customer'

const UserInfo = ({
  user,
  manualAddress,
  errors = {},
  onUserChange,
  onChange,
  onPostalCodeSubmit,
  postcodeLookingup
}) => {
  const currentLicenceOptions = getCurrentLicenceOptions()
  const handleChange = event => {
    const { name, value } = event.target
    onUserChange({ [name]: value })
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Details</div>
      <div className={styles.row}>
        <Input
          placeholder="Date Of Birth"
          name="dob"
          value={user.dob}
          className={styles.input}
          onChange={handleChange}
          required
        />
        <div className={styles.subtext}>DD/MM/YY</div>
        {errors.dob && <div className={styles.error}>{errors.dob}</div>}
        <Input
          placeholder="Telephone Number"
          name="phone"
          value={user.phone}
          className={styles.input}
          onChange={handleChange}
          required
        />
        {errors.dob && <div className={styles.error}>{errors.dob}</div>}
        <Select
          value={user.current_licences}
          name="current_licences"
          className={styles.input}
          onChange={handleChange}>
          <option>Current License</option>
          {currentLicenceOptions.map(licenseOption => (
            <option value={licenseOption.id}>{licenseOption.name}</option>
          ))}
        </Select>
        <div className={styles.subtext}>current licenses</div>
        <Select
          value={user.riding_experience}
          name="riding_experience"
          className={styles.input}
          onChange={handleChange}
          required>
          <option>Riding Experience</option>
          {RidingExperiences.map(ridingExperience => (
            <option value={ridingExperience.value}>
              {ridingExperience.title}
            </option>
          ))}
        </Select>
        <div className={styles.subtext}>riding experience</div>
        <Select
          value={user.rider_type}
          name="rider_type"
          className={styles.input}
          onChange={handleChange}
          required>
          <option>Rider Type</option>
          {RiderTypes.map(riderType => (
            <option value={riderType.value}>{riderType.title}</option>
          ))}
        </Select>
        <div className={styles.subtext}>rider type</div>
      </div>
      <div className={styles.title}>Delivery Address</div>
      {!manualAddress && (
        <div className={styles.row}>
          <Input
            placeholder="Postcode"
            name="postcode"
            className={styles.input}
            onKeyUp={event =>
              event.key === 'Enter' && onPostalCodeSubmit(event.target.value)
            }
            disabled={postcodeLookingup}
          />
          <div
            className={styles.actionDiv}
            onClick={() => onChange({ manualAddress: true })}>
            Enter address manually
          </div>
        </div>
      )}
      {manualAddress && (
        <div className={styles.row}>
          <AddressForm address={user} onChange={onUserChange} />
        </div>
      )}
    </div>
  )
}

export default UserInfo
