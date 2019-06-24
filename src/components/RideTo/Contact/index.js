import React, { Component, Fragment } from 'react'
import styles from './styles.scss'
import call from 'assets/icons/contact/call.svg'
import chat from 'assets/icons/contact/chat.svg'
import MapComponent from 'components/RideTo/MapComponent'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

class Contact extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      message: ''
    }
  }

  render() {
    return (
      <Fragment>
        <section className={styles.header}>
          <div className={styles.container}>
            <div className={styles.keyInfo}>
              <div className={styles.keyInfoItem}>
                <img src={chat} alt="Chat" />
                <div>
                  <h2>Chat with us</h2>
                  <p>Mon-Sat 9am-6pm • Sun Closed</p>
                </div>
              </div>
              <div className={styles.keyInfoItem}>
                <img src={call} alt="Call" />
                <div>
                  <h2>020 3603 9652</h2>
                  <p className={styles.callTimes}>
                    Mon-Sat 9am-6pm • Sun Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.body}>
          <div className={styles.container}>
            <div className={styles.bodyRow}>
              <div className={styles.formCol}>
                <h2 className={styles.formTitle}>Send us a message</h2>
                <p>
                  Got a question? We love to talk motorbikes, marketing and
                  ideas, especially over a good coffee. Drop us a line and one
                  of the team will be in touch.
                </p>
                <form className={styles.form}>
                  <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" />
                  </div>
                  <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" id="email" />
                  </div>
                  <div>
                    <label htmlFor="message">
                      Tell us what you want to discuss...
                    </label>
                    <textarea type="text" id="message"></textarea>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    <span className={styles.submitButtonText}>
                      Send us your message
                    </span>
                    <span>
                      <img src={ButtonArrowWhite} alt="Go" />
                    </span>
                  </button>
                </form>
              </div>
              <div className={styles.mapCol}>
                <MapComponent
                  className={styles.map}
                  sidebar
                  courses={[
                    {
                      id: 'rideto',
                      lat: 51.458496,
                      lng: -0.114057
                    }
                  ]}
                />
                <div className={styles.mapColInfo}>
                  <h3>Address</h3>
                  <p>49 Effra Rd, Brixton, London, SW2 1BZ</p>
                  <h3>Opening hours</h3>
                  <ol>
                    <li>
                      Monday <span>9am - 6pm</span>
                    </li>
                    <li>
                      Tuesday <span>9am - 6pm</span>
                    </li>
                    <li>
                      Wednesday <span>9am - 6pm</span>
                    </li>
                    <li>
                      Thursday <span>9am - 6pm</span>
                    </li>
                    <li>
                      Friday <span>9am - 6pm</span>
                    </li>
                    <li>
                      Saturday <span>Closed</span>
                    </li>
                    <li>
                      Sunday <span>Closed</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default Contact
