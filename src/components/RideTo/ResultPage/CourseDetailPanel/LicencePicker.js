import React from 'react'
import styles from './styles.scss'
import LicenceButton from './LicenceButton'

function LicencePicker({ selectedLicenceType, onUpdate, licences, isWidget }) {
  return (
    <div className={styles.licenceWrapper}>
      <label id="choose-licence" className={styles.subtitle1}>
        <span className={styles.stepNumber}>3</span> Choose licence type
      </label>
      <div>
        {licences.includes('a1') && (
          <LicenceButton
            isWidget={isWidget}
            type="A1"
            age="17+"
            size="Up to 125cc engine"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {licences.includes('a2') && (
          <LicenceButton
            isWidget={isWidget}
            type="A2"
            age="19+"
            size="Up to 35kW engine"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {licences.includes('a') && (
          <LicenceButton
            isWidget={isWidget}
            type="A"
            age="24+"
            size="Unrestricted engine"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  )
}

export default LicencePicker
