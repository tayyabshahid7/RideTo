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
  }

  render() {
    return (
      <div>
        <div>Filterszz</div>
        <Accordion allowMultipleExpanded allowZeroExpanded>
          <Item className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                Brand <Selected />
              </Button>
            </Heading>
            <Panel>asdf</Panel>
          </Item>
          <Item className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                Engine <Selected />
              </Button>
            </Heading>
            <Panel>asdf</Panel>
          </Item>
          <Item className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                Style <Selected />
              </Button>
            </Heading>
            <Panel>asdf</Panel>
          </Item>
          <Item className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                Budget <Selected />
              </Button>
            </Heading>
            <Panel>asdf</Panel>
          </Item>
          <Item className={styles.accordionItem}>
            <Heading>
              <Button className={styles.accordionButton}>
                Licence <Selected />
              </Button>
            </Heading>
            <Panel>asdf</Panel>
          </Item>
        </Accordion>
      </div>
    )
  }
}

export default Filters
