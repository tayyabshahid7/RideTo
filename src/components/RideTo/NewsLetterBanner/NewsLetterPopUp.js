import React from 'react'
import classnames from 'classnames'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

import animations from './animations'
import styles from './NewsLetterBanner.scss'
import ridetoLogo from 'assets/images/rideto-white.png'
import { submitForm } from '../../../services/hubspotAPI'
//
// const closeButton = ({onClick}) => {
//   return (
//     <div className={styles.closeButtonWrapper}>
//       <FontAwesomeIcon
//         className={styles.closeButton}
//         icon={faTimes}
//         onClick={onClick}
//         />
//     </div>
//   )
// }

class NewsLetterPopUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      submitted: false,
      error: ''
    }
  }

  componentDidMount() {
    // document.addEventListener('keydown', this.escFunction, false)
    this.fadeIn()
  }

  componentWillUnmount() {
    // document.removeEventListener('keydown', this.escFunction, false)
    this.fadeOut()
  }

  // escFunction = event => {
  //   if (event.keyCode === 27) {
  //     this.fadeOut()
  //   }
  // }

  handleSubmit = async e => {
    e.preventDefault()
    const response = await submitForm(
      '4630320',
      'a476a7f5-52bb-4ec4-b2f3-44facef36824',
      { email: this.state.email }
    )

    if (response.status === 200) {
      this.setState({ submitted: true })
      this.props.onSubmitted()
      this.fadeOut()
    } else {
      switch (response.status) {
        case 400:
          this.setState({ error: 'Please enter a valid email address.' })

          break
        default:
          this.setState({
            error: 'An unexpected error occured. Please Try again later.'
          })

          break
      }
    }
  }

  handleExit = () => {
    this.props.onExit()
    animations.fadeOut()
  }

  fadeIn = () => {
    disableBodyScroll()
    animations.fadeIn()
  }

  fadeOut = () => {
    animations.fadeOut(clearAllBodyScrollLocks)
  }

  render() {
    const { submitted, error } = this.state

    return (
      <div
        className={styles.newsLetterPopUpWrapper}
        id="news-banner-pop-up-container">
        <div className={styles.overlay} onClick={this.handleExit} />

        <form className={styles.form} onSubmit={this.handleSubmit}>
          <div className={styles.content}>
            <img
              src={ridetoLogo}
              className={styles.bannerPopUpImage}
              alt="company logo"
            />
            <div className={styles.bannerPopUpTitle}>
              Join the community and receive £5 off your first order.
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
              <span>Subscribe</span>
            </button>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </form>
      </div>
    )
  }
}

export default NewsLetterPopUp
