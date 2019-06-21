import React, { Component, Fragment } from 'react'
import styles from './styles.scss'

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
            <div className={styles.className}>
              <h2>Chat with us</h2>
              <p>Mon-Fri 9am-7pm • Sat-Sun 9am-4pm</p>
            </div>
            <div className={styles.className}>
              <h2>020 3603 9652</h2>
              <p>Mon-Fri 9am-7pm • Sat-Sun 9am-4pm</p>
            </div>
          </div>
        </section>
        <section className={styles.body}>
          <div className={styles.container}>
            <div>
              <h2>Send us a message</h2>
              <p>
                Got a question? We love to talk motorbikes, marketing and ideas,
                especially over a good coffee. Drop us a line and one of the
                team will be in touch.
              </p>
              <form>
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
                  <input type="text" id="message" />
                </div>
                <button>Send us your message</button>
              </form>
            </div>
            <div>
              <div>map</div>
              <div>
                <h3>Address</h3>
                <p>49 Effra Rd, Brixton, London, SW2 1BZ</p>
                <h3>Opening hours</h3>
                <ol>
                  <li>
                    Monday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Tuesday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Wednesday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Thursday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Friday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Saturday <span>9am - 7pm</span>
                  </li>
                  <li>
                    Sunday <span>9am - 7pm</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}

export default Contact
