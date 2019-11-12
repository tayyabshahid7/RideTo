import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import { ITEMS } from './content'
import StatusIcon from '../StatusIcon'
import { fetchUserChecklist, updateUserChecklist } from 'services/dashboard'
import shopIcon from 'assets/images/shop.svg'

const DEFAULT_LENGTH = 3

function MyCheckList({ userId }) {
  const [isChanged, setIsChanged] = useState(false)
  const [userList, setUserList] = useState([])
  const totalLength = userList.length
  const [visibleLength, setVisibleLength] = useState(DEFAULT_LENGTH)

  const handleViewAllClick = () => {
    if (visibleLength === DEFAULT_LENGTH) {
      setVisibleLength(totalLength)
    }
  }

  const handleCompletedClick = (id, isCompleted) => {
    setUserList(prevState =>
      prevState.map(item => {
        if (item[0] === id) {
          return [item[0], isCompleted]
        }

        return item
      })
    )
    setIsChanged(true)
  }

  useEffect(() => {
    async function loadList() {
      const response = await fetchUserChecklist(userId)

      setUserList(Object.entries(response))
    }

    if (userId && !userList.length) {
      loadList()
    }
  }, [userId])

  useEffect(() => {
    if (isChanged) {
      updateUserChecklist(userList)
      setIsChanged(false)
    }
  }, [userList, isChanged])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        My Checklist <img src={shopIcon} alt="" />
      </h2>
      <ul className={styles.list}>
        {userList.slice(0, visibleLength).map(([id, status]) => {
          const meta = ITEMS.find(item => item.id === id)

          return (
            <li key={id}>
              <StatusIcon
                transparent
                color="#d8d8d8"
                handleCompletedClick={handleCompletedClick}
                id={id}
                status={status ? 'completed' : 'not_completed'}
              />
              <a
                className={status ? styles.itemCompleted : undefined}
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer">
                {meta.title}
              </a>
            </li>
          )
        })}
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
