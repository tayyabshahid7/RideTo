import React from 'react'
import Listing from './Listing'
import BikeReview from './BikeReview'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { mapBike, fetchBikes } from 'services/bike-sales'
import ScrollToTop from 'components/RideTo/ScrollToTop'

class BikeSales extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      bikes: []
    }
  }

  async componentDidMount() {
    const { results } = await fetchBikes()

    this.setState({
      bikes: results.map(mapBike)
    })
  }

  render() {
    const { bikes } = this.state

    return (
      <Router>
        <ScrollToTop>
          <Route
            exact
            path="/bike-reviews/"
            render={routeProps => <Listing {...routeProps} bikes={bikes} />}
          />
          <Route
            path="/bike-reviews/:slug/"
            render={routeProps => <BikeReview {...routeProps} bikes={bikes} />}
          />
        </ScrollToTop>
      </Router>
    )
  }
}

export default BikeSales
