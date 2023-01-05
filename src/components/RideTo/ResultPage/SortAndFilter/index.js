import { IconMap, IconSortAndFilter } from 'assets/icons'
import React from 'react'

import styles from './styles.scss'

function SortAndFilter(props) {
  const { handleMapButton } = props

  return (
    <div className={styles.container}>
      <div
        className={styles.wrapper}
        onClick={() => {
          console.log('Sort & Filter')
        }}>
        <IconSortAndFilter />
        <span>Sort & Filter (3)</span>
      </div>
      <div className={styles.wrapper} onClick={handleMapButton}>
        <IconMap />
        <span>Map</span>
      </div>
    </div>
  )
}

export default SortAndFilter
