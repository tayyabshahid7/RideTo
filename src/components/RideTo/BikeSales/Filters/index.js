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
    const { options } = this.props

    return (
      <div>
        <div>Filterszz</div>
        <Accordion allowMultipleExpanded allowZeroExpanded>
          {options.map(({ name, values }) => (
            <Item key={name} className={styles.accordionItem}>
              <Heading>
                <Button className={styles.accordionButton}>
                  {name} <Selected />
                </Button>
              </Heading>
              <Panel className={styles.accordionPanel}>
                {values.map(value => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        onClick={event => {
                          this.handleCheckboxClick(event, name, value)
                        }}
                      />{' '}
                      {value}
                    </label>
                  </div>
                ))}
              </Panel>
            </Item>
          ))}
        </Accordion>
      </div>
    )
  }
}

export default Filters
