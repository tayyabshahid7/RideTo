import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'react-dates/initialize'

import { parseQueryString } from 'services/api'
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
    this.suppliers = window.RIDE_TO_DATA.widget_locations
  }

  getContainer(routeProps) {
    const { match, history } = routeProps
    const { slug } = match.params
    const onChangeSupplier = id => {
      history.push(`/widget/${slug}/details?supplier=${id}`)
    }
    const query = parseQueryString(window.location.search.slice(1))
    const selectedSupplier = query.supplier
      ? this.suppliers.filter(
          ({ id }) => id === parseInt(query.supplier, 10)
        )[0]
      : this.suppliers[0]

    return isMobile() ? (
      <MobileContainer
        {...routeProps}
        suppliers={this.suppliers}
        widget={this.widget}
        slug={slug}
        selectedSupplier={selectedSupplier}
        onChangeSupplier={onChangeSupplier}
      />
    ) : (
      <WidgetContainer
        {...routeProps}
        suppliers={this.suppliers}
        widget={this.widget}
        slug={slug}
        selectedSupplier={selectedSupplier}
      />
    )
  }

  render() {
    return (
      <Router>
        <div className={styles.widget}>
          <div className={styles.header}>
            <h1 className={styles.heading}>
              <img className={styles.logo} src={this.widget.logo} />
            </h1>
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
