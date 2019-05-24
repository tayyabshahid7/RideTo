import React, { Fragment } from 'react'
import Listing from './Listing'
import BikeReview from './BikeReview'
import { HashRouter as Router, Route } from 'react-router-dom'

const DATA = [
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSADV 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 77,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Honda',
      style: 'Adventure'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125 Classy',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 10,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Honda',
      style: 'Classic'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Ducati MSX 2000cc ADV',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 56,
    categories: {
      licence: 'A2 Licence',
      engine: '2000cc',
      brand: 'Ducati',
      style: 'Adventure'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Ducati CBR125 Super Moto',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 10,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Ducati',
      style: 'Super Moto'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 300 Adventure',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 9,
    categories: {
      licence: 'A1 Licence',
      engine: '300cc',
      brand: 'Honda',
      style: 'Adventure'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'BMW CBR125 Classic',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 10,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'BMW',
      style: 'Classic'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 125 Classico',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 11,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Honda',
      style: 'Classic'
    }
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125 Adventure',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
    reviews: 1,
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Honda',
      style: 'Adventure'
    }
  }
]

const DUMMY_DATA = [
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA,
  ...DATA
]
  .map((bike, i) => ({
    ...bike,
    id: i,
    name: `${i} ${bike.name}`
  }))
  .sort(() => Math.random() - 0.5)

function BikeSales() {
  return (
    <Router>
      <Fragment>
        <Route
          exact
          // path="/bike-sales/"
          path="/"
          render={routeProps => <Listing {...routeProps} bikes={DUMMY_DATA} />}
        />
        <Route
          // path="/bike-sales/bike/:id"
          path="/bike/:id"
          render={routeProps => (
            <BikeReview {...routeProps} bikes={DUMMY_DATA} />
          )}
        />
      </Fragment>
    </Router>
  )
}

export default BikeSales
