import React, { Component } from 'react'
import styles from '../styles.scss'
import Selected from './Selected'
import {
  Accordion,
  AccordionItem as Item,
  AccordionItemHeading as Heading,
  AccordionItemButton as Button,
  AccordionItemPanel as Panel
} from 'react-accessible-accordion'
import { capitalizeFirstLetter } from 'utils/helper'
import { getCourseTitle } from 'services/course'

class Filters extends Component {
  constructor(props) {
    super(props)

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
  }

  handleCheckboxClick(
    {
      target: { checked }
    },
    name,
    value
  ) {
    const { updateFilters } = this.props

    updateFilters(checked, name, value)
  }

  render() {
    const {
      options,
      reducedFilters,
      budgetMin,
      budgetMax,
      updateBudget
    } = this.props

    return (
      <Accordion allowMultipleExpanded allowZeroExpanded>
        {options.map(({ name, values }) => (
          <Item key={name} className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                {name}{' '}
                {name === 'Budget' ? (
                  <Selected
                    type={name}
                    budgetMin={budgetMin}
                    budgetMax={budgetMax}
                  />
                ) : (
                  <Selected
                    type={name}
                    selectedFilters={reducedFilters[name.toLowerCase()]}
                  />
                )}
              </Button>
            </Heading>
            <Panel className={styles.accordionPanel}>
              {name === 'Budget' ? (
                <div className={styles.budgetGroup}>
                  <label>
                    From{' '}
                    <input
                      value={budgetMin || ''}
                      type="number"
                      min="0"
                      step="100"
                      onChange={event => {
                        updateBudget('budgetMin', event.target.value)
                      }}
                      placeholder="Min value (£)"
                    />
                  </label>
                  <label>
                    To{' '}
                    <input
                      value={budgetMax || ''}
                      type="number"
                      min={budgetMin}
                      step="100"
                      onChange={event => {
                        updateBudget('budgetMax', event.target.value)
                      }}
                      placeholder="Max value (£)"
                    />
                  </label>
                </div>
              ) : (
                values.map(value => (
                  <div key={value.name}>
                    <label>
                      <input
                        className={styles.boxInput}
                        checked={value.active}
                        type="checkbox"
                        onChange={event => {
                          this.handleCheckboxClick(event, name, value.name)
                        }}
                      />{' '}
                      {name === 'Style'
                        ? capitalizeFirstLetter(value.name)
                        : name === 'Licence'
                        ? getCourseTitle(value.name)
                        : value.name}
                    </label>
                  </div>
                ))
              )}
            </Panel>
          </Item>
        ))}
      </Accordion>
    )
  }
}

export default Filters
