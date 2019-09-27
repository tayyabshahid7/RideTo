import React, { useState } from 'react'
import styles from './styles.scss'
import CircleList from '../CircleList'
import { ITEMS } from './content'

const DEFAULT_LENGTH = 3

function GuidesAdvice() {
  const totalLength = ITEMS.length
  const [visibleLength, setVisibleLength] = useState(DEFAULT_LENGTH)

  const handleViewAllClick = () => {
    if (visibleLength === DEFAULT_LENGTH) {
      setVisibleLength(totalLength)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Guides & advice</h2>
      <CircleList items={ITEMS.slice(0, visibleLength)} />
      {visibleLength !== totalLength && (
        <button onClick={handleViewAllClick} className={styles.viewAll}>
          Show more
        </button>
      )}
    </div>
  )
}

export default GuidesAdvice
