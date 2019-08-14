import React from 'react'
import styles from './styles.scss'
import CircleList from '../CircleList'
import { ITEMS } from './content'

function GuidesAdvice() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Guides & advice</h2>
      <CircleList items={ITEMS} />
    </div>
  )
}

export default GuidesAdvice
