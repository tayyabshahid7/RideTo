import React, { memo } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function MobileCategories({ categories, selectedCategory, onClick }) {
  const totalCategories = categories.length

  function splitArrayIntoParts(arr, len) {
    var chunks = [],
      i = 0,
      n = arr.length
    while (i < n) {
      chunks.push(arr.slice(i, (i += len)))
    }
    return chunks
  }

  if (!totalCategories) return null

  const newCategories = splitArrayIntoParts(categories, 3)

  return (
    <>
      {newCategories.map((chunk, idx) => {
        return (
          <div key={idx} className={styles.categoryContainer}>
            {chunk.map((item, idx2) => {
              return (
                <div
                  key={idx2}
                  onClick={() => onClick(item.name)}
                  className={classnames(
                    styles.cardContainer,
                    selectedCategory(item.name)
                  )}>
                  <img
                    className={styles.categoryImg}
                    src={item.icon}
                    alt="icon"
                  />
                  <p className={styles.topCategoryTitle}>{item.name}</p>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default memo(MobileCategories)
