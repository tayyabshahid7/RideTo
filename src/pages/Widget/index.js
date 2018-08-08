import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import WidgetContainer from 'pages/Widget/WidgetContainer'
import MobileContainer from 'pages/Widget/MobileContainer'

const isMobile = () => {
  return window.innerWidth < 768
}

class Widget extends React.Component {
  constructor(props) {
    super(props)

    this.profiles = window.RIDE_TO_DATA.widget_profiles
  }

  getContainer(routeProps) {
    const { match } = routeProps
    const { slug } = match.params
    console.log(slug, this.profiles)
    const profile = this.profiles.filter(p => p.slug === slug)[0]

    return isMobile() ? (
      <MobileContainer
        {...routeProps}
        profiles={this.profiles}
        profile={profile}
      />
    ) : (
      <WidgetContainer
        {...routeProps}
        profiles={this.profiles}
        profile={profile}
      />
    )
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            path="/widget/:slug"
            render={routeProps => this.getContainer(routeProps)}
          />
        </div>
      </Router>
    )
  }
}

export default Widget
