import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as notificationModule from 'store/notification'
import styles from './NotificationContainer.scss'
import Notification from 'pages/Notifications/components/Notification'

class NotificationContainer extends React.Component {
  render() {
    const { notifications, dismissNotification } = this.props

    if (notifications.length) {
      return (
        <div className={styles.notificationContainer}>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              notification={notification}
              onClick={() => dismissNotification(notification.id)}
            />
          ))}
        </div>
      )
    }

    return null
  }
}

const mapStateToProps = (state, props) => {
  return {
    notifications: state.notification.items
  }
}

export default connect(
  mapStateToProps,
  dispatch =>
    bindActionCreators(
      {
        ...notificationModule.actions
      },
      dispatch
    )
)(NotificationContainer)
