import React from 'react'
import styles from './styles.scss'

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
      <h2 className={styles.title}>Gudies & advice</h2>
      <ul className={styles.list}>
        {ITEMS.map(({ title, url }, i) => (
          <li>
            <a href={url}>
              <span className={styles.circle}>{i + 1}</span>
              <span className={styles.linkTitle}>{title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GuidesAdvice
