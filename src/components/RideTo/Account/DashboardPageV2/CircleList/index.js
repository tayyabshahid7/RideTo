import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function CircleList({ items, size }) {
  return (
    <ul
      className={classnames(styles.list, size === 'small' && styles.listSmall)}>
      {items.map(({ title, url }, i) => (
        <li key={i}>
          <a href={url}>
            <span className={styles.circle}>{i + 1}</span>
            <span className={styles.linkTitle}>{title}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default CircleList
