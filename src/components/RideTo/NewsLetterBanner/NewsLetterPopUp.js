import React, { Fragment } from 'react'
import classnames from 'classnames'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify'

import { isAuthenticated } from 'services/auth'
import animations from './animations'
import styles from './NewsLetterBanner.scss'
import ridetoLogo from 'assets/images/rideto-white.png'
import { submitForm } from '../../../services/hubspotAPI'

class NewsLetterPopUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      submitted: false
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false)
    this.fadeIn()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false)

    this.fadeOut()
  }

  handleSubmit = async e => {
    e.preventDefault()
    const response = await submitForm(
      '4630320',
      'a476a7f5-52bb-4ec4-b2f3-44facef36824',
      { email: this.state.email }
    )

    if (response.status === 200) {
      this.setState({ submitted: true })
      this.fadeOut()
    } else {
      switch (response.status) {
        case 400:
          toast.warn('Please enter a valid email address.', {
            className: styles.warningNotification
          })

          break
        default:
          toast.error('An unexpected error occured. Please Try again later.', {
            className: styles.errorNotification
          })
          break
      }
    }
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      this.fadeOut()
    }
  }

  fadeIn = () => {
    if (!isAuthenticated()) {
      disableBodyScroll()
      animations.fadeIn()
    }
  }

  fadeOut = () => {
    this.props.onClose()
    animations.fadeOut(clearAllBodyScrollLocks)
  }

  render() {
    const { submitted } = this.state

    return (
      <div
        className={styles.newsLetterPopUpWrapper}
        id="news-banner-pop-up-container">
        <div className={styles.overlay} onClick={this.fadeOut} />

        <form className={styles.form} onSubmit={this.handleSubmit}>
          <div className={styles.content}>
            <div className={styles.closeButtonWrapper}>
              <FontAwesomeIcon
                className={styles.closeButton}
                icon={faTimes}
                onClick={this.fadeOut}
              />
            </div>
            <img
              src={ridetoLogo}
              className={styles.bannerPopUpImage}
              alt="company logo"
            />
            <div className={styles.bannerPopUpTitle}>
              Sign Up to RideTo and Get £5 Discount
            </div>
            <input
              name="email"
              onChange={e => this.setState({ email: e.target.value })}
              className={styles.bannerPopUpInput}
              type="text"
              placeholder="Enter email address"
            />
            <button
              className={classnames(
                styles.bannerPopUpSubmit,
                submitted && styles.submitted
              )}
              type="submit">
              <span>
                {submitted ? (
                  <Fragment>
                    Submitted
                    <FontAwesomeIcon icon={faCheck} />
                  </Fragment>
                ) : (
                  'Submit'
                )}
              </span>
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    )
  }
}

export default NewsLetterPopUp
