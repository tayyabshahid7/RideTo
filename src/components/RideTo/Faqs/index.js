import React, { Component, Fragment } from 'react'

import classnames from 'classnames'
import styles from './Faqs.scss'

import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import Button from 'components/RideTo/Button'
import SidePanel from 'components/RideTo/SidePanel'
import FaqsDetails from 'components/RideTo/FaqsDetails'

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
        <div class={classnames(styles.faqsResults, styles.hiddenOnMobile)}>
          <div
            class={classnames('container', styles.container, styles.faqsIntro)}>
            <div class={styles.faqsContent}>
              <h3 class={styles.faqsSectionHeading}>
                Motorcycle Training FAQs
              </h3>
              <div class={styles.content}>
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
              <h3 class={styles.faqsSectionHeading}>Speak to our team</h3>
              <div class={styles.content}>
                Give us a call for more information and to speak to the team.
                Our lines are open 8am-7pm Monday to Friday and 9am-4pm Saturday
                to Sunday.
              </div>
              <Button className={styles.arrowButton}>
                <span> Contact Us</span>
                <img src={ArrowRight} alt="button arrow" />
              </Button>
            </div>
            <div>
              <img
                src="/static/images/home-carousel-image-3.jpg"
                class={classnames(styles.getStartedImage, styles.right)}
                height="480"
                width="340"
                alt=""
              />
              <img
                src="/static/images/home-page-image-2.jpg"
                class={classnames(styles.getStartedImage, styles.left)}
                height="480"
                width="340"
                alt=""
              />
            </div>
          </div>
        </div>
        <SidePanel
          visible={sidePanelVisible}
          headingImage={'/static/images/home-carousel-image-1.jpg'}
          onDismiss={() => this.setState({ sidePanelVisible: false })}>
          <FaqsDetails />
        </SidePanel>
      </Fragment>
    )
  }
}

export default Faqs
