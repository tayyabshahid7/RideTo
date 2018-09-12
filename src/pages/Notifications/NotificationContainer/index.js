import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import * as notificationModule from 'store/notification'
import styles from './NotificationContainer.scss'
import Notification from 'pages/Notifications/components/Notification'

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { notifications } = this.props

    return (
      <div className={styles.notificationContainer}>
        {notifications.map(notification => (
          <Notification notification={notification} />
        ))}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  console.log(props, state)
  return {
    notifications: state.notification.items
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({}, dispatch)
)(NotificationContainer)
