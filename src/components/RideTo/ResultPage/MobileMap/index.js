import React from 'react'
import styles from './styles.scss'

import { IconLocale } from 'assets/icons'

function MobileMap({
  children,
  handleSearchLocationButton,
  hasSearchLocation,
  handleMyLocation
}) {
  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleMyLocation}>
        <IconLocale />
      </button>

      {hasSearchLocation && (
        <button
          className={styles.searchLocationButton}
          onClick={handleSearchLocationButton}>
          Search Location
        </button>
      )}

      <div className={styles.map}>{children}</div>
    </div>
  )
}

export default MobileMap
