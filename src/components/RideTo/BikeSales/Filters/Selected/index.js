import React from 'react'
import styles from '../../styles.scss'
import { AccordionItemState as State } from 'react-accessible-accordion'

function Selected({ selectedFilters, budgetMin, budgetMax }) {
  const isBudget = !selectedFilters
  const onlyMin = budgetMin && !budgetMax
  const onlyMax = !budgetMin && budgetMax
  const isAll =
    selectedFilters === 'All' || (isBudget && (!budgetMin && !budgetMax))
  const budgetText = `${onlyMin ? 'From ' : onlyMax ? 'To ' : ''}${[
    budgetMin,
    budgetMax
  ]
    .filter(Boolean)
    .map(value => `£${value}`)
    .join(' - ')}`

  return (
    <span className={!isAll ? styles.accordionButtonSelection : undefined}>
      {isAll ? 'All' : isBudget ? budgetText : selectedFilters.join(', ')}{' '}
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
