import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'react-dates/initialize'

import WidgetContainer from 'pages/Widget/WidgetContainer'
import MobileContainer from 'pages/Widget/MobileContainer'
import PaymentContainer from 'pages/Widget/PaymentContainer'
import ConfirmationContainer from 'pages/Widget/ConfirmationContainer'

import styles from './Widget.scss'

const isMobile = () => {
  return window.innerWidth < 768 || window.screen.width < 768
}

class Widget extends React.Component {
  constructor(props) {
    super(props)

    this.widget = window.RIDE_TO_DATA.widget_initial
  }

  getContainer(routeProps) {
    return isMobile() ? (
      <MobileContainer {...routeProps} />
    ) : (
      <WidgetContainer {...routeProps} />
    )
  }

  render() {
    return (
      <Router>
        <div className={styles.widget}>
          <div className={styles.header}>
            {this.widget.logo && (
              <h1 className={styles.heading}>
                <img
                  alt="School Logo"
                  className={styles.logo}
                  src={this.widget.logo}
                />
              </h1>
            )}
          </div>

          <Route
            path="/widget/:slug/payment/:courseId"
            component={PaymentContainer}
          />

          <Route
            exact
            path="/widget/:slug"
            render={routeProps => this.getContainer(routeProps)}
          />

          <Route
            exact
            path="/widget/:slug/details"
            render={routeProps => <WidgetContainer {...routeProps} />}
          />

          <Route
            exact
            path="/widget/:slug/confirmation"
            component={ConfirmationContainer}
          />
        </div>
      </Router>
    )
  }
}

export default Widget
