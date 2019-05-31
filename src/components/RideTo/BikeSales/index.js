import React, { Fragment } from 'react'
import Listing from './Listing'
import BikeReview from './BikeReview'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const DATA = [
  {
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    images: [
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/ff0000',
      'https://via.placeholder.com/330x172',
      'https://via.placeholder.com/330x172/00ff00'
    ],
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
    name: `${i} ${bike.name}`,
    bhp: 7.2,
    mpg: 150,
    intro:
      "That's the lorem ipsum. And it's ipsum dolor sit amet blah blah blah lorem blah yeah. Yep",
    goodPoints: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    badPoints: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
    bodyContent: `<h3>The ride</h3>
      <p>
        Because it’s so small you can just fly around town, hitting gaps
        in traffic that aren’t really on, before buzzing off into the
        distance. The suspension is ultra soft, as is the enormous seat,
        but on the rough roads of
        <a href="https://www.google.com">London</a>’s West End, it was
        my derrière’s best friend.
      </p>
      <p>
        The only downside to this soft ride is that there’s a max system
        weight of 105kg, which you could easily reach if you’ve got all
        your gear on and a bag full of swag.
      </p>
      <img
        src="https://via.placeholder.com/588x440"
        alt="Placeholder"
      />
      <blockquote>
        <p>
          "That’s the Monkey in a nutshell. And its reliable engine’s
          the same; the air-cooled, fuel-injected horizontal 125cc"
        </p>
        <footer>
          <cite>James Jameson</cite> carwow expert
        </footer>
      </blockquote>`
  }))
  .sort(() => Math.random() - 0.5)

function BikeSales() {
  return (
    <Router>
      <Fragment>
        <Route
          exact
          path="/bike-sales/"
          render={routeProps => <Listing {...routeProps} bikes={DUMMY_DATA} />}
        />
        <Route
          path="/bike-sales/bike/:id"
          render={routeProps => (
            <BikeReview {...routeProps} bikes={DUMMY_DATA} />
          )}
        />
      </Fragment>
    </Router>
  )
}

export default BikeSales
