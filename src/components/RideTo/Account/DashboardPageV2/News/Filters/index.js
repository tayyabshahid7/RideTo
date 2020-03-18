import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'

function Filters({ selectedFilter, handleFilterClick, filters }) {
  const isDesktop = useMediaQuery({ minWidth: 768 })

  return (
    <ul className={styles.list}>
      {filters
        .filter(item => !(!isDesktop && ['Events', 'Fun'].includes(item)))
        .map(filter => (
          <li className={styles.listItem} key={filter}>
            <button
              id={filter.toLowerCase().replace(/\s/g, '-')}
              className={classnames(
                styles.filterButton,
                filter === selectedFilter && styles.active
              )}
              onClick={() => {
                handleFilterClick(filter)
              }}>
              {!isDesktop & (filter === 'Latest Blogs')
                ? 'Blogs'
                : filter.replace('How Tos', "How To's")}
            </button>
          </li>
        ))}
    </ul>
  )
}

export default Filters
