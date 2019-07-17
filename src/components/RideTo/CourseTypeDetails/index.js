import React from 'react'

import styles from './CourseTypeDetails.scss'
import DetailsAccordionItem from 'components/RideTo/DetailsAccordionItem'
import SummaryIcons from './SummaryIcons'
import classnames from 'classnames'

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
    const {
      courseType,
      title,
      minimal,
      spacedOut = false,
      useKeysAsTitle,
      fullLicenceFaqs
    } = this.props
    const { opened } = this.state
    const { details, tags } = courseType

    const courseTitle = title || courseType.name

    return (
      <div
        className={classnames(
          styles.courseTypeDetails,
          minimal && styles.courseTypeDetailsMinimal
        )}>
        {!minimal && (
          <React.Fragment>
            <div className={styles.title}>{courseTitle}</div>
            <div className={styles.description}>{details.description}</div>
            <SummaryIcons tags={tags} />
            <hr className={styles.divider} />
          </React.Fragment>
        )}

        {useKeysAsTitle ? (
          <div className={styles.accordion}>
            {Object.entries(details).map(([title, text]) => (
              <DetailsAccordionItem
                key={title}
                spacedOut={spacedOut}
                fullLicenceFaqs={fullLicenceFaqs}
                title={title}
                content={text}
                isOpen={opened.indexOf(title) > -1}
                onToggle={isOpen => this.handleToggleAccordion(title, isOpen)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.accordion}>
            {details.whatLicenceDoYouNeed && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What licence do you need? "
                content={details.whatLicenceDoYouNeed}
                isOpen={opened.indexOf('whatLicenceDoYouNeed') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('whatLicenceDoYouNeed', isOpen)
                }
              />
            )}

            {details.whatIsACBTLicence && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What is a CBT licence? "
                content={details.whatIsACBTLicence}
                isOpen={opened.indexOf('whatIsACBTLicence') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('whatIsACBTLicence', isOpen)
                }
              />
            )}

            {details.passingYourTheoryTest && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Passing your theory test"
                content={details.passingYourTheoryTest}
                isOpen={opened.indexOf('passingYourTheoryTest') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('passingYourTheoryTest', isOpen)
                }
              />
            )}

            {details.gettingYourFullLicence && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Getting your full licence"
                content={details.gettingYourFullLicence}
                isOpen={opened.indexOf('gettingYourFullLicence') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('gettingYourFullLicence', isOpen)
                }
              />
            )}

            {details.howMuchTraining && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="How much training do I need?"
                content={details.howMuchTraining}
                isOpen={opened.indexOf('howMuchTraining') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('howMuchTraining', isOpen)
                }
              />
            )}

            {details.doesTheBike && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Does the bike I train on effect my licence? "
                content={details.doesTheBike}
                isOpen={opened.indexOf('doesTheBike') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('doesTheBike', isOpen)
                }
              />
            )}

            {details.iHaveEU && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="I have an EU licence, what do I need? "
                content={details.iHaveEU}
                isOpen={opened.indexOf('iHaveEU') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('iHaveEU', isOpen)
                }
              />
            )}

            {details.howDoIPass && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="How do I pass the CBT test? "
                content={details.howDoIPass}
                isOpen={opened.indexOf('howDoIPass') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('howDoIPass', isOpen)
                }
              />
            )}

            {details.iDontHave && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="I don't have a licence/ have non-EU licence, what do I need? "
                content={details.iDontHave}
                isOpen={opened.indexOf('iDontHave') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('iDontHave', isOpen)
                }
              />
            )}

            {details.doINeed && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Do I need to take an ITM? "
                content={details.doINeed}
                isOpen={opened.indexOf('doINeed') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('doINeed', isOpen)
                }
              />
            )}

            {details.whatWillIdO && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What will I do during the ITM?"
                content={details.whatWillIdO}
                isOpen={opened.indexOf('whatWillIdO') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('whatWillIdO', isOpen)
                }
              />
            )}

            {details.howFarAdvance && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="How far in advance should I book?"
                content={details.howFarAdvance}
                isOpen={opened.indexOf('howFarAdvance') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('howFarAdvance', isOpen)
                }
              />
            )}

            {details.iCantSee && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="I can't see any Introduction courses in my area?"
                content={details.iCantSee}
                isOpen={opened.indexOf('iCantSee') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('iCantSee', isOpen)
                }
              />
            )}

            {details.canIJustBook && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Can I just book the tests?"
                content={details.canIJustBook}
                isOpen={opened.indexOf('canIJustBook') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('canIJustBook', isOpen)
                }
              />
            )}

            {details.iveCompleted && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="I've completed my Module 1 somewhere else, can you help me with Module 2?"
                content={details.iveCompleted}
                isOpen={opened.indexOf('iveCompleted') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('iveCompleted', isOpen)
                }
              />
            )}

            {details.whatSize && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What size bike can I ride after?"
                content={details.whatSize}
                isOpen={opened.indexOf('whatSize') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('whatSize', isOpen)
                }
              />
            )}

            {details.duration && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="How long is the course?"
                content={details.duration}
                isOpen={opened.indexOf('duration') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('duration', isOpen)
                }
              />
            )}

            {details.learn && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What will I learn?"
                content={details.learn}
                isOpen={opened.indexOf('learn') > -1}
                onToggle={isOpen => this.handleToggleAccordion('learn', isOpen)}
              />
            )}
            {details.included && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What's Included?"
                content={details.included}
                isOpen={opened.indexOf('included') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('included', isOpen)
                }
              />
            )}
            {details.ride_after && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="What can I ride after?"
                content={details.ride_after}
                isOpen={opened.indexOf('ride_after') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('ride_after', isOpen)
                }
              />
            )}
            {details.requirements && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Requirements"
                content={details.requirements}
                isOpen={opened.indexOf('requirements') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('requirements', isOpen)
                }
              />
            )}
            {details.faqs && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Training FAQs"
                content={details.faqs}
                isOpen={opened.indexOf('faqs') > -1}
                onToggle={isOpen => this.handleToggleAccordion('faqs', isOpen)}
              />
            )}
            {details.cancellation && (
              <DetailsAccordionItem
                spacedOut={spacedOut}
                title="Cancellation Policy"
                content={details.cancellation}
                isOpen={opened.indexOf('cancellation') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('cancellation', isOpen)
                }
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default CourseTypeDetails
