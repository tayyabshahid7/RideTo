import React from 'react'

import styles from './FaqsDetails.scss'
import DetailsAccordionItem from 'components/RideTo/DetailsAccordionItem'
import { getCourseFaqs } from 'services/course-type'

class FaqsDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: [],
      faqs: []
    }

    this.handleToggleAccordion = this.handleToggleAccordion.bind(this)
  }

  componentDidMount() {
    this.setState({ faqs: getCourseFaqs() })
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
    const { opened, faqs } = this.state

    return (
      <div className={styles.courseTypeDetails}>
        <div className={styles.title}>Frequently Asked Questions</div>
        <div className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <hr className={styles.divider} />
        <div className={styles.accordion}>
          {faqs.map((faq, index) => (
            <DetailsAccordionItem
              key={index}
              title={faq.question}
              content={faq.answer}
              isOpen={opened.indexOf('open' + index) > -1}
              onToggle={isOpen =>
                this.handleToggleAccordion('open' + index, isOpen)
              }
            />
          ))}
        </div>
      </div>
    )
  }
}

export default FaqsDetails
