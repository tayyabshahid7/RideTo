import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import LicenceButton from './LicenceButton'

function LicencePicker({
  selectedLicenceType,
  onUpdate,
  licences,
  isWidget,
  needsHelp = false
}) {
  const [showAll, setShowAll] = useState(!needsHelp)
  let filteredLicences = licences

  useEffect(() => {
    setShowAll(!needsHelp)
  }, [needsHelp])

  const onShowAllClick = () => {
    setShowAll(true)
  }

  if (!showAll && selectedLicenceType) {
    filteredLicences = licences.filter(
      licence => selectedLicenceType.toLowerCase() === licence
    )

    if (filteredLicences.length === 0) {
      setShowAll(true)
    }
  }

  return (
    <div className={styles.licenceWrapper}>
      <label id="choose-licence" className={styles.subtitle1}>
        {!needsHelp && <span className={styles.stepNumber}>3</span>} Licence
        type{' '}
        {needsHelp && !showAll && (
          <button className={styles.showAllButton} onClick={onShowAllClick}>
            Show all
          </button>
        )}
      </label>
      <div>
        {filteredLicences.includes('a1') && (
          <LicenceButton
            isWidget={isWidget}
            type="A1"
            age="17+"
            size="Up to 125cc engine"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {filteredLicences.includes('a2') && (
          <LicenceButton
            isWidget={isWidget}
            type="A2"
            age="19+"
            size="Up to 35kW engine"
            selectedLicenceType={selectedLicenceType}
            onUpdate={onUpdate}
          />
        )}
        {filteredLicences.includes('a') && (
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
