import React from 'react'
import styles from './styles.scss'
import LicenceButton from './LicenceButton'

function LicencePicker({ selectedLicenceType, onUpdate }) {
  return (
    <div className={styles.licenceWrapper}>
      <label id="choose-licence" className={styles.subtitle1}>
        Licence Type
      </label>
      <div>
        <LicenceButton
          type="A1"
          age="17+"
          size="up to 125cc"
          selectedLicenceType={selectedLicenceType}
          onUpdate={onUpdate}
        />
        <LicenceButton
          type="A2"
          age="19+"
          size="up to 400cc"
          selectedLicenceType={selectedLicenceType}
          onUpdate={onUpdate}
        />
        <LicenceButton
          type="A"
          age="24+"
          size="all"
          selectedLicenceType={selectedLicenceType}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  )
}

export default LicencePicker
