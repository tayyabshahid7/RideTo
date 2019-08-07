import React from 'react'
import styles from './styles.scss'
import CircleList from '../CircleList'

const ITEMS = [
  {
    title: 'Riding Guide',
    url: 'http://google.com'
  },
  {
    title: 'Maintenance Guide',
    url: 'http://google.com'
  },
  {
    title: 'Bikes Guide',
    url: 'http://google.com'
  }
]

function GuidesAdvice() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Guides & advice</h2>
      <CircleList items={ITEMS} />
    </div>
  )
}

export default GuidesAdvice
