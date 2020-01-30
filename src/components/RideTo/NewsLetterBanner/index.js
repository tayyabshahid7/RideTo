import React, { Fragment } from 'react'
import classnames from 'classnames'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { isAuthenticated } from 'services/auth'
import animations from './animations'
import styles from './NewsLetterBanner.scss'
import ridetoLogo from 'assets/images/rideto-white.png'

import { submitForm } from '../../../services/hubspotAPI'

class NewsLetterBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      submitted: false,
      error: ''
    }
  }

  componentDidMount() {
    this.fadeIn()
  }

  componentWillUnmount() {
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
          this.setState({ error: 'invalid Input' })
          break
        default:
          this.setState({ error: 'An eror occured.' })
          break
      }
    }
  }

  fadeIn = () => {
    if (!isAuthenticated()) {
      disableBodyScroll()
      animations.fadeIn()
    }
  }

  fadeOut = () => {
    animations.fadeOut(clearAllBodyScrollLocks)
  }

  render() {
    const { submitted, error } = this.state

    if (error) alert(error)

    return (
      <div className={styles.newsLetterBannerWrapper}>
        <div className={styles.overlay} />

        <form className={styles.content} onSubmit={this.handleSubmit}>
          <img
            src={ridetoLogo}
            className={styles.bannerImage}
            alt="company logo"
          />
          <div className={styles.bannerTitle}>
            Sign Up to RideTo and Get £5 Discount
          </div>
          <input
            name="email"
            onChange={e => this.setState({ email: e.target.value })}
            className={styles.bannerInput}
            type="text"
            placeholder="Enter email address"
          />
          <button
            className={classnames(
              styles.bannerSubmit,
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
        </form>
      </div>
    )
  }
}

export default NewsLetterBanner
