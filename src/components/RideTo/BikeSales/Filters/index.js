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
    const { options, reducedFilters } = this.props

    return (
      <Accordion allowMultipleExpanded allowZeroExpanded>
        {options.map(({ name, values }) => (
          <Item key={name} className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                {name}{' '}
                <Selected
                  selectedFilters={reducedFilters[name.toLowerCase()]}
                />
              </Button>
            </Heading>
            <Panel className={styles.accordionPanel}>
              {values.map(value => (
                <div key={value.name}>
                  <label>
                    <input
                      checked={value.active}
                      type="checkbox"
                      onChange={event => {
                        this.handleCheckboxClick(event, name, value.name)
                      }}
                    />{' '}
                    {value.name}
                  </label>
                </div>
              ))}
            </Panel>
          </Item>
        ))}
      </Accordion>
    )
  }
}

export default Filters
