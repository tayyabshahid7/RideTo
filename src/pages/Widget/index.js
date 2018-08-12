import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'react-dates/initialize'

import { parseQueryString } from 'services/api'
import WidgetContainer from 'pages/Widget/WidgetContainer'
import MobileContainer from 'pages/Widget/MobileContainer'
import PaymentContainer from 'pages/Widget/PaymentContainer'

import styles from './Widget.scss'

const isMobile = () => {
  return window.innerWidth < 768 || window.screen.width < 768
}

class Widget extends React.Component {
  constructor(props) {
    super(props)

    this.widget = window.RIDE_TO_DATA.widget_initial
    this.locations = window.RIDE_TO_DATA.widget_locations
  }

  getContainer(routeProps) {
    const { match, history } = routeProps
    const { slug } = match.params
    const onChangeLocation = locId => {
      history.push(`/widget/${slug}/?location=${locId}`)
    }
    const query = parseQueryString(window.location.search.slice(1))
    const selectedLocation = query.location
      ? this.locations.filter(
          ({ id }) => id === parseInt(query.location, 10)
        )[0]
      : this.locations[0]

    return isMobile() ? (
      <MobileContainer
        {...routeProps}
        locations={this.locations}
        widget={this.widget}
        slug={slug}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
      />
    ) : (
      <WidgetContainer
        {...routeProps}
        locations={this.locations}
        widget={this.widget}
        slug={slug}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
      />
    )
  }

  render() {
    return (
      <Router>
        <div className={styles.widget}>
          <Route
            path="/widget/:slug/payment/:courseId"
            component={PaymentContainer}
          />

          <Route
            exact
            path="/widget/:slug"
            render={routeProps => this.getContainer(routeProps)}
          />
        </div>
      </Router>
    )
  }
}

export default Widget
