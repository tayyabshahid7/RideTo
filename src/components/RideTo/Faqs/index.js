import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import classnames from 'classnames'
import Button from 'components/RideTo/Button'
import FaqsDetails from 'components/RideTo/FaqsDetails'
import SidePanel from 'components/RideTo/SidePanel'
import React, { Component, Fragment } from 'react'
import styles from './Faqs.scss'

export class Faqs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidePanelVisible: false
    }
  }

  render() {
    const { sidePanelVisible } = this.state
    return (
      <Fragment>
        <div className={classnames(styles.faqsResults)}>
          <div
            className={classnames(
              'container',
              styles.container,
              styles.faqsIntro
            )}>
            <div className={styles.faqsContent}>
              <h3 className={styles.faqsSectionHeading}>
                Motorcycle Training FAQs
              </h3>
              <div className={styles.content}>
                Here’s some of the questions other RideTo riders have asked. If
                these don’t answer your question, contact us, we’d love to help!
              </div>
              <Button
                className={styles.arrowButton}
                onClick={() => this.setState({ sidePanelVisible: true })}>
                <span> Read Faqs</span>
                <img src={ArrowRight} alt="button arrow" />
              </Button>
              <br />
              <br />
              <br />
              <h3 className={styles.faqsSectionHeading}>Speak to our team</h3>
              <div className={styles.content}>
                Give us a call for more information and to speak to the team.
                Our lines are open 9am-6pm Monday to Saturday.
              </div>
              <Button
                className={styles.arrowButton}
                onClick={() => (window.location = '/contact')}>
                <span> Contact Us</span>
                <img src={ArrowRight} alt="button arrow" />
              </Button>
            </div>
            <div className={styles.images}>
              <img
                src="https://rideto-production.imgix.net/static/images/home-carousel-image-3.jpg?q=80&auto=format,compress,true"
                className={classnames(styles.getStartedImage, styles.right)}
                height="480"
                width="340"
                alt=""
              />
              <img
                src="https://rideto-production.imgix.net/static/images/home-page-image-2.jpg?q=80&auto=format,compress,true"
                className={classnames(styles.getStartedImage, styles.left)}
                height="480"
                width="340"
                alt=""
              />
            </div>
          </div>
        </div>
        <SidePanel
          visible={sidePanelVisible}
          headingImage={
            'https://rideto-production.imgix.net/static/images/home-carousel-image-1.jpg?q=80&auto=format,compress,true'
          }
          onDismiss={() => this.setState({ sidePanelVisible: false })}>
          <FaqsDetails />
        </SidePanel>
      </Fragment>
    )
  }
}

export default Faqs
