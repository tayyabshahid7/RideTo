import React from 'react'
import styles from '../../styles.scss'
import { AccordionItemState as State } from 'react-accessible-accordion'

function Selected({ selectedFilters }) {
  const isAll = selectedFilters === 'All'

  return (
    <span className={!isAll ? styles.accordionButtonSelection : undefined}>
      {isAll ? 'All' : selectedFilters.join(', ')}{' '}
      <State>
        {({ expanded }) => {
          const className = `fas fa-chevron-${expanded ? 'down' : 'right'}`

          return (
            <span key={className} className={styles.accordionButtonIcon}>
              <i className={className} />
            </span>
          )
        }}
      </State>
    </span>
  )
}

export default Selected
