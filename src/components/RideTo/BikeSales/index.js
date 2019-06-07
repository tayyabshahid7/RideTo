import React, { Fragment } from 'react'
import Listing from './Listing'
import BikeReview from './BikeReview'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { mapBike, fetchBikes } from 'services/bike-sales'

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
        <Fragment>
          <Route
            exact
            path="/bike-review/"
            render={routeProps => <Listing {...routeProps} bikes={bikes} />}
          />
          <Route
            path="/bike-review/bike/:id"
            render={routeProps => <BikeReview {...routeProps} bikes={bikes} />}
          />
        </Fragment>
      </Router>
    )
  }
}

export default BikeSales
