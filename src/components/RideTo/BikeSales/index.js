import React, { Component, Fragment } from 'react'
import Drawer from 'rc-drawer'
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

class BikeSales extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filtersOpen: false,
      sortOpen: false
    }

    this.handleFiltersButtonClick = this.handleFiltersButtonClick.bind(this)
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this)
  }

  handleFiltersButtonClick() {
    this.setState({
      filtersOpen: true
      // sortOpen: false
    })
  }

  handleSortButtonClick() {
    this.setState({
      // filtersOpen: false,
      sortOpen: true
    })
  }

  render() {
    const { filtersOpen, sortOpen } = this.state

    return (
      <Fragment>
        <div className={styles.header}>
          <div className={styles.container}>
            <div>
              <h1>RideTo Bikers</h1>
              <h2>Let's find you the perfect ride.</h2>
            </div>
            <div className={styles.filterButtons}>
              <button
                className={styles.filterButton}
                onClick={this.handleFiltersButtonClick}>
                Filters
              </button>
              <button
                className={styles.filterButton}
                onClick={this.handleSortButtonClick}>
                Sort
              </button>
            </div>
            <div className={styles.results}>
              Results: {DUMMY_DATA.length} bikes found
            </div>
          </div>
        </div>
        <div className={styles.listing}>
          <div className={styles.container}>
            <div className={styles.row}>
              {DUMMY_DATA.map((bike, i) => (
                <div className={styles.item} key={i}>
                  <BikeSummary bike={bike} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Drawer
          width="250px"
          handler={false}
          open={filtersOpen}
          placement="left">
          filters
        </Drawer>
        <Drawer width="250px" handler={false} open={sortOpen} placement="right">
          sort
        </Drawer>
      </Fragment>
    )
  }
}

export default BikeSales
