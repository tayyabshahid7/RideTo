import React from 'react'

import styles from './CourseTypeDetails.scss'
import DetailsAccordionItem from './DetailsAccordionItem'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

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
    const { courseType, url } = this.props
    const { opened } = this.state
    const { details } = courseType

    return (
      <div className={styles.courseTypeDetails}>
        <h5>{courseType.name}</h5>
        <div className={styles.description}>{details.description}</div>

        <hr className={styles.divider} />

        <div className={styles.accordion}>
          <DetailsAccordionItem
            title="What will I learn?"
            content={details.learn}
            isOpen={opened.indexOf('learn') > -1}
            onToggle={isOpen => this.handleToggleAccordion('learn', isOpen)}
          />
          <DetailsAccordionItem
            title="What's Included?"
            content={details.included}
            isOpen={opened.indexOf('included') > -1}
            onToggle={isOpen => this.handleToggleAccordion('included', isOpen)}
          />
          <DetailsAccordionItem
            title="What can I ride after?"
            content={details.ride_after}
            isOpen={opened.indexOf('ride_after') > -1}
            onToggle={isOpen =>
              this.handleToggleAccordion('ride_after', isOpen)
            }
          />
          <DetailsAccordionItem
            title="Requirements"
            content={details.requirements}
            isOpen={opened.indexOf('requirements') > -1}
            onToggle={isOpen =>
              this.handleToggleAccordion('requirements', isOpen)
            }
          />
          <DetailsAccordionItem
            title="Training FAQs"
            content={details.faqs}
            isOpen={opened.indexOf('faqs') > -1}
            onToggle={isOpen => this.handleToggleAccordion('faqs', isOpen)}
          />
          <DetailsAccordionItem
            title="Cancellation Policy"
            content={details.cancellation}
            isOpen={opened.indexOf('cancellation') > -1}
            onToggle={isOpen =>
              this.handleToggleAccordion('cancellation', isOpen)
            }
          />
        </div>

        <Button href={url} className={styles.action}>
          <span>Book Now</span>
          <img src={ButtonArrowWhite} />
        </Button>
      </div>
    )
  }
}

export default CourseTypeDetails
