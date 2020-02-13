import React from 'react'
import styles from './CourseTypeDetails.scss'
import DetailsAccordionItem from 'components/RideTo/DetailsAccordionItem'
import SummaryIcons from './SummaryIcons'
import classnames from 'classnames'
import { scroller } from 'react-scroll'

class CourseTypeDetails extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: [props.opened] || []
    }

    this.handleToggleAccordion = this.handleToggleAccordion.bind(this)
  }

  componentDidMount() {
    if (this.props.opened) {
      scroller.scrollTo('pom', {
        duration: 1500,
        delay: 300,
        smooth: true,
        containerId: 'sidepanel'
      })
    }
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
      fullLicenceFaqs,
      contentStyle,
      titleStyle
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
                name={title}
                titleStyle={titleStyle}
                contentStyle={contentStyle}
                key={title}
                spacedOut={spacedOut}
                fullLicenceFaqs={fullLicenceFaqs}
                title={title}
                content={text}
                isOpen={opened.indexOf(title) > -1}
                onToggle={isOpen => this.handleToggleAccordion(title, isOpen)}>
                {text}
              </DetailsAccordionItem>
            ))}
          </div>
        ) : (
          <div className={styles.accordion}>
            {details.whatLicenceDoYouNeed && (
              <DetailsAccordionItem
                name="whatLicenceDoYouNeed"
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
                name="whatIsACBTLicence"
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
                name="passingYourTheoryTest"
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
                name="gettingYourFullLicence"
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
                name="howMuchTraining"
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
                name="doesTheBike"
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
                name="iHaveEU"
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
                name="howDoIPass"
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
                name="iDontHave"
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
                name="doINeed"
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
                name="whatWillIdO"
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
                name="howFarAdvance"
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
                name="iCantSee"
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
                name="canIJustBook"
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
                name="iveCompleted"
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
                name="whatSize"
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
                name="duration"
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
                name="learn"
                spacedOut={spacedOut}
                title="What will I learn?"
                content={details.learn}
                isOpen={opened.indexOf('learn') > -1}
                onToggle={isOpen => this.handleToggleAccordion('learn', isOpen)}
              />
            )}
            {details.included && (
              <DetailsAccordionItem
                name="included"
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
                name="ride_after"
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
                name="requirements"
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
                name="faqs"
                spacedOut={spacedOut}
                title="Training FAQs"
                content={details.faqs}
                isOpen={opened.indexOf('faqs') > -1}
                onToggle={isOpen => this.handleToggleAccordion('faqs', isOpen)}
              />
            )}
            {details.cancellation && (
              <DetailsAccordionItem
                name="cancellation"
                spacedOut={spacedOut}
                title="Cancellation Policy"
                content={details.cancellation}
                isOpen={opened.indexOf('cancellation') > -1}
                onToggle={isOpen =>
                  this.handleToggleAccordion('cancellation', isOpen)
                }
              />
            )}
            {details.pom && (
              <DetailsAccordionItem
                name="pom"
                spacedOut={spacedOut}
                title="Peace of Mind Policy"
                content={details.pom}
                isOpen={opened.indexOf('pom') > -1}
                onToggle={isOpen => this.handleToggleAccordion('pom', isOpen)}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default CourseTypeDetails
