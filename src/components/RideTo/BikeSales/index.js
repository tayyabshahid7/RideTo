import React, { Fragment } from 'react'
import styles from './styles.scss'
import BikeSummary from './BikeSummary'

const DUMMY_DATA = [
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSX 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  },
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda CBR125',
    price: 344900,
    desc: 'Blah lorem blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/'
  }
]

function BikeSales() {
  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.container}>
          <div>
            <h1>RideTo Bikers</h1>
            <h2>Let's find you the perfect ride.</h2>
          </div>
          <div className={styles.filterButtons}>
            <button className={styles.filterButton}>Filters</button>
            <button className={styles.filterButton}>Sort</button>
          </div>
          <div>Results: 205 bikes found</div>
        </div>
      </div>
      <div className={styles.listing}>
        <div className={styles.container}>
          <div className={styles.row}>
            {DUMMY_DATA.map(bike => (
              <div className={styles.item}>
                <BikeSummary bike={bike} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default BikeSales
