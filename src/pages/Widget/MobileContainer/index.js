import React from 'react'

import styles from './MobileContainer.scss'
import MobileDetails from 'pages/Widget/components/MobileDetails'
import BookingOptions from 'pages/Widget/components/BookingOptions'

class MobileContainer extends React.Component {
  constructor(props) {
    super(props)
    this.widget = window.RIDE_TO_DATA.widget_initial
    this.handleNav = this.handleNav.bind(this)
  }

  handleNav(page) {
    const { match, history } = this.props
    const { slug } = match.params

    history.push(`/widget/${slug}/details`)
  }

  render() {
    return (
      <div className={styles.mobileContainer}>
        <MobileDetails widget={this.widget} onContinue={this.handleNav} />
      </div>
    )
  }
}

export default MobileContainer
