import React from 'react'

import styles from './CourseTypeDetails.scss'
import DetailsAccordionItem from './DetailsAccordionItem'

class CourseTypeDetails extends React.Component {
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
    const { courseType } = this.props
    const { opened } = this.state
    const { details } = courseType

    return (
      <div className={styles.courseTypeDetails}>
        <h5>{courseType.name}</h5>
        <div className={styles.description}>{details.description}</div>

        <div className={styles.accordion}>
          <DetailsAccordionItem
            title="What will I learn?"
            content={details.learn}
            isOpen={opened.indexOf('learn') > -1}
            onToggle={isOpen => this.handleToggleAccordion('learn', isOpen)}
          />
        </div>
      </div>
    )
  }
}

export default CourseTypeDetails
