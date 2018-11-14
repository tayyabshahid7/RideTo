import React, { Component } from 'react'
import DetailsAccordionItem from 'components/RideTo/DetailsAccordionItem'
import styles from './FooterLinks.scss'

class FooterLinks extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: []
    }

    this.handleToggleAccordion = this.handleToggleAccordion.bind(this)
  }

  handleToggleAccordion(name, isOpen) {
    const { opened } = this.state
    if (isOpen) {
      this.setState({
        opened: opened.concat([name])
      })
    } else {
      this.setState({
        opened: opened.filter(n => n !== name)
      })
    }
  }

  render() {
    const { opened } = this.state

    return (
      <div className={styles.links}>
        <DetailsAccordionItem
          title="Support"
          content={`<div class="footer--links">
              <a href="https://www.rideto.com/contact">Contact us</a>
              <a href="http://learn.rideto.com/frequently-asked-questions">FAQs</a>
              <a href="http://www.work.rideto.com/">Delivery Jobs</a>
              <a href="https://www.rideto.com/blog">Blog</a>
            </div>`}
          isOpen={opened.indexOf('support') > -1}
          onToggle={isOpen => this.handleToggleAccordion('support', isOpen)}
          className={styles.footerAccordionItem}
        />
        <DetailsAccordionItem
          title="Company"
          content={`<div class="footer--links">
              <a href="https://www.rideto.com/aboutus">About Us</a>
              <a href="https://angel.co/rideto/jobs">Careers</a>
              <a href="https://www.rideto.com/terms">Terms &amp; Conditions</a>
              <a href="https://www.rideto.com/privacy">Privacy</a>
              <a href="https://www.rideto.com/terms-of-use">Terms of Use</a>
            </div>`}
          isOpen={opened.indexOf('company') > -1}
          onToggle={isOpen => this.handleToggleAccordion('company', isOpen)}
          className={styles.footerAccordionItem}
        />
        <DetailsAccordionItem
          title="Locations"
          content={`<div class="footer--links">
              <a href="https://www.rideto.com/cbt-training/london">London</a>
              <a href="https://www.rideto.com/cbt-training/manchester">Manchester</a>
              <a href="https://www.rideto.com/cbt-training/birmingham">Birmingham</a>
              <a href="https://www.rideto.com/cbt-training/bristol">Bristol</a>
              <a href="https://www.rideto.com/all-locations">View All</a>
            </div>`}
          isOpen={opened.indexOf('locations') > -1}
          onToggle={isOpen => this.handleToggleAccordion('locations', isOpen)}
          className={styles.footerAccordionItem}
        />
        <DetailsAccordionItem
          title="Courses"
          content={`<div class="footer--links">
              <a href="/cbt-training">CBT Training</a>
              <a href="/introduction-to-motorcycling">Introduction to Motorcycling</a>
              <a href="/motorcycle-license">Full Motorcycle License</a>
              <a href="/gear-conversion-course">Gear Conversion Course</a>
              <a href="/121-cbt-training">121 CBT Training</a>
            </div>`}
          isOpen={opened.indexOf('courses') > -1}
          onToggle={isOpen => this.handleToggleAccordion('courses', isOpen)}
          className={styles.footerAccordionItem}
        />
      </div>
    )
  }
}

export default FooterLinks
