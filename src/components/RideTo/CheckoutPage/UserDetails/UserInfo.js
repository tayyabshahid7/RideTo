import React from 'react'
import { RidingExperiences, RiderTypes } from 'common/info'
import Input from 'components/RideTo/Input'
import Select from 'components/RideTo/Select'
import AddressForm from 'components/AddressForm'
import styles from './styles.scss'
import { getCurrentLicenceOptions } from 'services/customer'

const UserInfo = ({
  details,
  manualAddress,
  errors = {},
  onDetailChange,
  onChange,
  onPostalCodeSubmit,
  postcodeLookingup
}) => {
  const currentLicenceOptions = getCurrentLicenceOptions()
  const handleChange = event => {
    const { name, value } = event.target
    onDetailChange(name, value)
  }
  const handleAddressChange = (name, value) => {
    onDetailChange(`address.${name}`, value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Your Details</div>
      <div className={styles.row}>
        <Input
          placeholder="Date Of Birth"
          name="user_birthdate"
          value={details.user_birthdate}
          className={styles.input}
          onChange={handleChange}
          required
        />
        <div className={styles.subtext}>DD/MM/YYYY</div>
        {errors.user_birthdate && (
          <div className={styles.error}>{errors.user_birthdate}</div>
        )}
        <Input
          placeholder="Telephone Number"
          name="phone"
          value={details.phone}
          className={styles.input}
          onChange={handleChange}
          required
        />
        {errors.phone && <div className={styles.error}>{errors.phone}</div>}
        <Select
          value={details.current_licence}
          name="current_licence"
          className={styles.input}
          onChange={handleChange}>
          <option>Current License</option>
          {currentLicenceOptions.map(licenseOption => (
            <option value={licenseOption.id} key={licenseOption.id}>
              {licenseOption.name}
            </option>
          ))}
        </Select>
        <div className={styles.subtext}>current licenses</div>
        {errors.current_licence && (
          <div className={styles.error}>{errors.current_licence}</div>
        )}
        <Select
          value={details.riding_experience}
          name="riding_experience"
          className={styles.input}
          onChange={handleChange}
          required>
          <option>Riding Experience</option>
          {RidingExperiences.map(ridingExperience => (
            <option value={ridingExperience.value} key={ridingExperience.value}>
              {ridingExperience.title}
            </option>
          ))}
        </Select>
        <div className={styles.subtext}>riding experience</div>
        {errors.riding_experience && (
          <div className={styles.error}>{errors.riding_experience}</div>
        )}
        <Select
          value={details.rider_type}
          name="rider_type"
          className={styles.input}
          onChange={handleChange}
          required>
          <option>Rider Type</option>
          {RiderTypes.map(riderType => (
            <option value={riderType.value} key={riderType.value}>
              {riderType.title}
            </option>
          ))}
        </Select>
        <div className={styles.subtext}>rider type</div>
        {errors.rider_type && (
          <div className={styles.error}>{errors.rider_type}</div>
        )}
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
          <AddressForm
            address={details.address}
            onChange={handleAddressChange}
            errors={errors.address}
          />
        </div>
      )}
    </div>
  )
}

export default UserInfo
