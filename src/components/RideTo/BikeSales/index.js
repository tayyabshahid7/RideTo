import React, { Fragment } from 'react'
import Listing from './Listing'
import BikeReview from './BikeReview'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { mapBike } from 'services/bike-sales'

// const DATA = [
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Honda MSADV 125',
//     price: 420000,
//     desc: 'Blah blah blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 77,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'Honda',
//       style: 'Adventure'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Honda CBR125 Classy',
//     price: 344900,
//     desc: 'Blah lorem blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 10,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'Honda',
//       style: 'Classic'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Ducati MSX 2000cc ADV',
//     price: 420000,
//     desc: 'Blah blah blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 56,
//     categories: {
//       licence: 'A2 Licence',
//       engine: '2000cc',
//       brand: 'Ducati',
//       style: 'Adventure'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Ducati CBR125 Super Moto',
//     price: 344900,
//     desc: 'Blah lorem blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 10,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'Ducati',
//       style: 'Super Moto'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Honda MSX 300 Adventure',
//     price: 420000,
//     desc: 'Blah blah blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 9,
//     categories: {
//       licence: 'A1 Licence',
//       engine: '300cc',
//       brand: 'Honda',
//       style: 'Adventure'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'BMW CBR125 Classic',
//     price: 344900,
//     desc: 'Blah lorem blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 10,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'BMW',
//       style: 'Classic'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Honda MSX 125 Classico',
//     price: 420000,
//     desc: 'Blah blah blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 11,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'Honda',
//       style: 'Classic'
//     }
//   },
//   {
//     images: [
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/ff0000',
//       'https://via.placeholder.com/330x172',
//       'https://via.placeholder.com/330x172/00ff00'
//     ],
//     name: 'Honda CBR125 Adventure',
//     price: 344900,
//     desc: 'Blah lorem blah blah',
//     bookLink: 'https://www.google.com/',
//     reviewLink: 'https://www.google.com/',
//     reviews: 1,
//     categories: {
//       engine: '125cc',
//       licence: 'CBT',
//       brand: 'Honda',
//       style: 'Adventure'
//     }
//   }
// ]
//   .map((bike, i) => ({
//     ...bike,
//     id: i,
//     name: `${i} ${bike.name}`,
//     bhp: 7.2,
//     mpg: 150,
//     score: 80,
//     range: 235,
//     requiredLicence: 'LICENCE_CBT',
//     insuranceGroup: '12',
//     intro:
//       "That's the lorem ipsum. And it's ipsum dolor sit amet blah blah blah lorem blah yeah. Yep",
//     goodPoints: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
//     badPoints: ['Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'],
//     bodyContent: `<h3>The ride</h3>
//       <p>
//         Because it’s so small you can just fly around town, hitting gaps
//         in traffic that aren’t really on, before buzzing off into the
//         distance. The suspension is ultra soft, as is the enormous seat,
//         but on the rough roads of
//         <a href="https://www.google.com">London</a>’s West End, it was
//         my derrière’s best friend.
//       </p>
//       <p>
//         The only downside to this soft ride is that there’s a max system
//         weight of 105kg, which you could easily reach if you’ve got all
//         your gear on and a bag full of swag.
//       </p>
//       <img
//         src="https://via.placeholder.com/588x440"
//         alt="Placeholder"
//       />
//       <blockquote>
//         <p>
//           "That’s the Monkey in a nutshell. And its reliable engine’s
//           the same; the air-cooled, fuel-injected horizontal 125cc"
//         </p>
//         <footer>
//           <cite>James Jameson</cite> carwow expert
//         </footer>
//       </blockquote>`
//   }))
//   .sort(() => Math.random() - 0.5)

const DATA = [
  {
    id: 1,
    created: '2019-06-04T12:19:01.484305Z',
    modified: '2019-06-05T09:49:49.684223Z',
    slug: '22-honda-msx-125-classico',
    content:
      '<h3>This is a rich text area</h3><p>With html</p><p>with images and stuff</p><br>',
    is_active: true,
    bike_model: '22 Honda MSX 125 Classico',
    brand: 'Honda',
    style: 'STANDARD',
    engine: '125cc',
    desc: 'Blah blah blah blah',
    intro:
      "That's the lorem ipsum. And it's ipsum dolor sit amet blah blah blah lorem blah yeah. Yep",
    price_currency: 'GBP',
    price: '4200.00',
    rideto_score: 80,
    required_licence: 'CBT_LICENCE',
    bhp: '7.2',
    max_speed: '160',
    mpg: '150',
    miles_range: '235',
    insurance_group: 12,
    author: 2798,
    images: [
      {
        image: 'https://via.placeholder.com/350x150'
      },
      {
        image: 'https://via.placeholder.com/350x150g'
      },
      {
        image: 'https://via.placeholder.com/350x150'
      },
      {
        image: 'https://via.placeholder.com/350x150'
      }
    ],
    bad_points: [
      {
        bad_point: 'Lorem ipsum'
      },
      {
        bad_point: 'Lorem ipsum'
      },
      {
        bad_point: 'Lorem ipsum'
      }
    ],
    good_points: [
      {
        good_point: 'Lorem ipsum'
      },
      {
        good_point: 'Lorem ipsum'
      },
      {
        good_point: 'Lorem ipsum'
      }
    ]
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
].map(mapBike)

function BikeSales() {
  return (
    <Router>
      <Fragment>
        <Route
          exact
          path="/bike-review/"
          render={routeProps => <Listing {...routeProps} bikes={DUMMY_DATA} />}
        />
        <Route
          path="/bike-review/bike/:id"
          render={routeProps => (
            <BikeReview {...routeProps} bikes={DUMMY_DATA} />
          )}
        />
      </Fragment>
    </Router>
  )
}

export default BikeSales
