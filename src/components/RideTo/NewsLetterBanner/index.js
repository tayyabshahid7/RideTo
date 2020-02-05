import React from 'react'
import { isAuthenticated } from 'services/auth'
import styles from './NewsLetterBanner.scss'
import NewsLetterPopUp from './NewsLetterPopUp'

class NewsLetterBanner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopUp: false,
      submitted: false
    }
  }

  render() {
    const { showPopUp, submitted } = this.state

    if (submitted || isAuthenticated()) return null

    if (showPopUp)
      return (
        <NewsLetterPopUp
          onSubmitted={() => {
            this.setState({
              showPopUp: false,
              submitted: true
            })
          }}
          onExit={() => {
            this.setState({
              showPopUp: false,
              submitted: false
            })
          }}
        />
      )

    return (
      <div
        className={styles.newsLetterBannerWrapper}
        onClick={() => {
          this.setState({
            showPopUp: true
          })
        }}>
        <h4 className={styles.bannerText}>
          Sign Up to RideTo and Get £5 Discount
        </h4>
      </div>
    )
  }
}

export default NewsLetterBanner
