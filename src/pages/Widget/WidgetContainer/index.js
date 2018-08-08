import React from 'react'

import BookingOptions from 'pages/Widget/components/BookingOptions'
import Details from 'pages/Widget/components/Details'
import styles from './WidgetContainer.scss'

class WidgetContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleChangeProfile = this.handleChangeProfile.bind(this)
  }

  handleChangeProfile(slug) {
    const { history } = this.props
    history.push(`/widget/${slug}/`)
  }

  render() {
    const { profile, profiles } = this.props

    return (
      <div className={styles.widgetContainer}>
        <Details profile={profile} />
        <BookingOptions
          profile={profile}
          profiles={profiles}
          onChangeProfile={this.handleChangeProfile}
        />
      </div>
    )
  }
}

export default WidgetContainer
