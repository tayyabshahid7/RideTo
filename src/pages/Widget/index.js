import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'react-dates/initialize'

import WidgetContainer from 'pages/Widget/WidgetContainer'
import MobileContainer from 'pages/Widget/MobileContainer'

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
    const { slug, locationId } = match.params
    const onChangeLocation = locationId => {
      history.push(`/widget/${slug}/${locationId}`)
    }
    const selectedLocation = locationId
      ? this.locations.filter(({ id }) => id === parseInt(locationId, 10))[0]
      : this.locations[0]

    return isMobile() ? (
      <MobileContainer
        {...routeProps}
        locations={this.locations}
        widget={this.widget}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
      />
    ) : (
      <WidgetContainer
        {...routeProps}
        locations={this.locations}
        widget={this.widget}
        selectedLocation={selectedLocation}
        onChangeLocation={onChangeLocation}
      />
    )
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            path="/widget/:slug/:locationId?"
            render={routeProps => this.getContainer(routeProps)}
          />
        </div>
      </Router>
    )
  }
}

export default Widget
