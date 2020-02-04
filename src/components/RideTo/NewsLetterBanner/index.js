import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import styles from './NewsLetterBanner.scss'
import NewsLetterPopUp from './NewsLetterPopUp'

toast.configure()

class NewsLetterBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showPopUp: false,
      popUpClosed: false
    }
  }

  render() {
    const { showPopUp, popUpClosed } = this.state

    if (popUpClosed) return null

    if (showPopUp)
      return (
        <NewsLetterPopUp
          onClose={() => {
            this.setState({ popUpClosed: true })
          }}
        />
      )

    return (
      <div
        className={styles.newsLetterBannerWrapper}
        onClick={() => {
          this.setState({ showPopUp: true })
        }}>
        <h4 className={styles.bannerText}>subscribe to the newsletter</h4>

        <ToastContainer />
      </div>
    )
  }
}

export default NewsLetterBanner
