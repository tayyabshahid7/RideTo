import React from 'react'
import styles from '../../styles.scss'
import { AccordionItemState as State } from 'react-accessible-accordion'
import { capitalizeFirstLetter } from 'utils/helper'
import { getCourseTitle } from 'services/course'

function Selected({ selectedFilters, budgetMin, budgetMax, type }) {
  const isBudget = type === 'Budget'
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
  let filters = selectedFilters

  if (!isAll && type === 'Style') {
    filters = selectedFilters.map(filter => capitalizeFirstLetter(filter))
  }

  if (!isAll && type === 'Licence') {
    filters = selectedFilters.map(filter => getCourseTitle(filter))
  }

  return (
    <span className={!isAll ? styles.accordionButtonSelection : undefined}>
      {isAll ? 'All' : isBudget ? budgetText : filters.join(', ')}{' '}
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
