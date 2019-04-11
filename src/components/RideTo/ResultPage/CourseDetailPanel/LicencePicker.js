import React from 'react'
import styles from './styles.scss'
import LicenceButton from './LicenceButton'

function LicencePicker({ selectedLicenceType, onUpdate, licences, isWidget }) {
  return (
    <div className={styles.licenceWrapper}>
      <label id="choose-licence" className={styles.subtitle1}>
        Licence
      </label>
      <div>
        {licences.includes('a1') && (
          <LicenceButton
            isWidget={isWidget}
            type="A1"
            age="17+"
            size="up to 125cc"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {licences.includes('a2') && (
          <LicenceButton
            isWidget={isWidget}
            type="A2"
            age="19+"
            size="up to 35kW"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {licences.includes('a') && (
          <LicenceButton
            isWidget={isWidget}
            type="A"
            age="24+"
            size="Unrestricted"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default LicencePicker
