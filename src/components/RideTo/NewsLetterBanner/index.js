import React, { Fragment } from 'react'
import classnames from 'classnames'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import animations from './animations'
import styles from './NewsLetterBanner.scss'
import ridetoLogo from 'assets/images/rideto-white.png'

class NewsLetterBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = { submitted: false }
  }
  componentDidMount() {
    this.fadeIn()
  }

  componentWillUnmount() {
    this.fadeOut()
  }

  handleSubmit = e => {
    e.preventDefault()
    //send info to backend
    //show success
    this.fadeOut()
  }

  fadeIn = () => {
    disableBodyScroll()
    animations.fadeIn()
  }

  fadeOut = () => {
    this.setState({ submitted: true })
    animations.fadeOut(clearAllBodyScrollLocks)
  }

  render() {
    const { submitted } = this.state

    const submitButtonClassName = classnames(
      styles.bannerSubmit,
      submitted && styles.submitted
    )

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
            className={styles.bannerInput}
            type="text"
            placeholder="Enter email address"
          />
          <button className={submitButtonClassName} type="submit">
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
