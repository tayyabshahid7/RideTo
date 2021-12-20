import React, { Fragment, useState } from 'react'
import styles from './styles.scss'
// import call from 'assets/icons/contact/call.svg'
// import chat from 'assets/icons/contact/chat.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Aeroplane from 'assets/images/rideto/Aeroplane.svg'
import { post } from 'services/api'
import MediaQuery from 'react-responsive'
import { Helmet } from 'react-helmet'
import closeSvg from 'assets/images/rideto/CloseDark.svg'

function Contact({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [order, setOrder] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    setError('')

    try {
      await post(
        'contact/new-message',
        { name, email, message, order, subject },
        false
      )
      setSent(true)
    } catch (error) {
      setError(Object.values(error.response.data)[0][0])
    }
  }

  // const handleBack = () => {
  //   setName('')
  //   setEmail('')
  //   setMessage('')
  //   setSent(false)
  //   setError('')
  // }

  return (
    <Fragment>
      <Helmet>
        <title>Contact Us | RideTo</title>
      </Helmet>
      {/* <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.keyInfo}>
            <div className={styles.keyInfoItem}>
              <img src={chat} alt="Chat" />
              <div className={styles.keyInfoItemText}>
                <h2>Chat with us</h2>
                <p>Mon - Sun 9am - 6pm</p>
              </div>
              <div className={styles.keyInfoItemTextMobile}>Chat</div>
            </div>
            <a className={styles.keyInfoItem} href="tel:+442036039652">
              <img src={call} alt="Call" />
              <div className={styles.keyInfoItemText}>
                <h2>020 3603 9652</h2>
                <p>Mon - Sun 9am - 6pm</p>
              </div>
              <div className={styles.keyInfoItemTextMobile}>Call</div>
            </a>
          </div>
        </div>
      </section> */}
      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <button onClick={onClose} className={styles.closeButton}>
              <img src={closeSvg} alt="close" />
            </button>
            {!sent && (
              <>
                <h2 className={styles.formTitle}>Send us a message</h2>
                <p className={styles.introText}>
                  Got a question? Drop us a message and one of the team will
                  reply.
                </p>
              </>
            )}
            {!sent ? (
              <MediaQuery minWidth={769}>
                {matches => {
                  return (
                    <form className={styles.form} onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="name">Name</label>
                        <input
                          required
                          type="text"
                          id="name"
                          onChange={event => setName(event.target.value)}
                          value={name}
                          placeholder={matches ? '' : 'Name'}
                        />
                      </div>
                      <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                          required
                          type="text"
                          id="email"
                          onChange={event => setEmail(event.target.value)}
                          placeholder={matches ? '' : 'Email Address'}
                        />
                      </div>
                      <div>
                        <label htmlFor="order">Order Number</label>
                        <input
                          type="text"
                          id="order"
                          onChange={event => setOrder(event.target.value)}
                          placeholder={matches ? '' : 'Order Number'}
                        />
                      </div>
                      <div>
                        <label htmlFor="subject">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          onChange={event => setSubject(event.target.value)}
                          placeholder={matches ? '' : 'Subject'}
                        />
                      </div>
                      <div>
                        <label htmlFor="message">
                          Tell us what you want to discuss...
                        </label>
                        <textarea
                          placeholder={
                            matches ? '' : 'Tell us what you want to discuss...'
                          }
                          required
                          type="text"
                          id="message"
                          onChange={event =>
                            setMessage(event.target.value)
                          }></textarea>
                      </div>
                      <button type="submit" className={styles.submitButton}>
                        <span className={styles.submitButtonText}>
                          Send us your message
                        </span>
                        <span>
                          <img src={ButtonArrowWhite} alt="Go" />
                        </span>
                      </button>
                      {error && <div className={styles.error}>{error}</div>}
                    </form>
                  )
                }}
              </MediaQuery>
            ) : (
              <div className={styles.form}>
                <div className={styles.successMessage}>
                  <h3>
                    <span className={styles.tick}>
                      <img
                        className={styles.iconPlane}
                        src={Aeroplane}
                        alt="icon"
                      />
                    </span>{' '}
                    Message sent
                  </h3>
                  <p>We'll be back in touch as soon as possible.</p>
                  <button className={styles.buttonClose} onClick={onClose}>
                    CLOSE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Contact