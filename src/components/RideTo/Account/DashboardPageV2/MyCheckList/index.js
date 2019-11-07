import React, { useState } from 'react'
import styles from './styles.scss'
import { ITEMS } from './content'
import StatusIcon from '../StatusIcon'

const DEFAULT_LENGTH = 3

function MyCheckList() {
  const [items, setItems] = useState(ITEMS)
  const totalLength = items.length
  const [visibleLength, setVisibleLength] = useState(DEFAULT_LENGTH)

  const handleViewAllClick = () => {
    if (visibleLength === DEFAULT_LENGTH) {
      setVisibleLength(totalLength)
    }
  }

  const handleCompletedClick = (id, isCompleted) => {
    setItems(prevState =>
      prevState.map(item => {
        if (item.title === id) {
          return {
            ...item,
            status: isCompleted ? 'completed' : 'not_completed'
          }
        }

        return item
      })
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Checklist</h2>
      <ul className={styles.list}>
        {items.slice(0, visibleLength).map(({ title, url, status }) => (
          <li key={title}>
            <StatusIcon
              transparent
              color="#d8d8d8"
              handleCompletedClick={handleCompletedClick}
              id={title}
              status={status}
            />
            <a href={url} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          </li>
        ))}
      </ul>
      {visibleLength !== totalLength && (
        <button onClick={handleViewAllClick} className={styles.viewAll}>
          Show more
        </button>
      )}
    </div>
  )
}

export default MyCheckList
