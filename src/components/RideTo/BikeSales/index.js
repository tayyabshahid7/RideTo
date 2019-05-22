import React, { Component } from 'react'
import SlidingPane from 'react-sliding-pane'
import Modal from 'react-modal'
import styles from './styles.scss'
import BikeSummary from './BikeSummary'
import Filters from './Filters'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import { isEqual } from 'lodash'

const DUMMY_DATA = [
  {
    image: 'https://via.placeholder.com/330x200',
    name: 'Honda MSADV 125',
    price: 420000,
    desc: 'Blah blah blah blah',
    bookLink: 'https://www.google.com/',
    reviewLink: 'https://www.google.com/',
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
    categories: {
      engine: '125cc',
      licence: 'CBT',
      brand: 'Honda',
      style: 'Adventure'
    }
  }
]

const FILTERS = [
  { name: 'Brand', values: ['Honda', 'BMW', 'Susuki', 'Ducati'] },
  {
    name: 'Engine',
    values: ['50cc', '125cc', '200cc', '300cc', '400cc', '2000cc']
  },
  { name: 'Style', values: ['Adventure', 'Classic', 'Scooter', 'Super Moto'] },
  { name: 'Budget', values: [] },
  { name: 'Licence', values: ['CBT', 'A1 Licence', 'A2 Licence', 'A Licence'] }
]

function reduceFilters(filters) {
  return filters.reduce((obj, option) => {
    const name = option.name.toLowerCase()

    obj[name] = option.values
      .filter(value => value.active)
      .reduce((arr, value) => {
        arr.push(value.name)
        return arr
      }, [])

    if (obj[name].length === 0) {
      obj[name] = 'All'
    }

    return obj
  }, {})
}

class BikeSales extends Component {
  constructor(props) {
    super(props)

    this.state = {
      filtersOpen: false,
      sortOpen: false,
      filters: FILTERS.map(option => ({
        ...option,
        values: option.values.map(value => ({
          name: value,
          active: false
        }))
      })),
      bikes: DUMMY_DATA
    }

    this.updateFilters = this.updateFilters.bind(this)
    this.handleFiltersButtonClick = this.handleFiltersButtonClick.bind(this)
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this)
  }

  componentDidMount() {
    Modal.setAppElement(document.getElementById('bike-sales-root'))
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.state.filters, prevState.filters)) {
      const reducedFilters = reduceFilters(this.state.filters)

      this.setState({
        bikes: DUMMY_DATA.filter(bike => {
          return Object.entries(bike.categories).every(([name, value]) => {
            if (
              reducedFilters[name] !== 'All' &&
              !reducedFilters[name].includes(value)
            ) {
              return false
            }
            return true
          })
        })
      })
    }
  }

  updateFilters(active, name, valueToSet) {
    this.setState({
      filters: this.state.filters.map(option => {
        if (option.name === name) {
          return {
            ...option,
            values: option.values.map(value => {
              if (value.name === valueToSet) {
                return {
                  ...value,
                  active
                }
              }

              return value
            })
          }
        }

        return option
      })
    })
  }

  handleFiltersButtonClick() {
    const { filtersOpen } = this.state
    this.setState({
      filtersOpen: !filtersOpen
    })
  }

  handleSortButtonClick() {
    const { sortOpen } = this.state
    this.setState({
      sortOpen: !sortOpen
    })
  }

  render() {
    const { filtersOpen, sortOpen, bikes } = this.state

    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.container}>
            <div>
              <h1>RideTo Bikes</h1>
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
              Results: {bikes.length} bikes found
            </div>
          </div>
        </div>
        <div className={styles.listing}>
          <div className={styles.container}>
            <div className={styles.row}>
              {bikes.map((bike, i) => (
                <div className={styles.item} key={i}>
                  <BikeSummary bike={bike} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <SlidingPane
          width="60%"
          className={styles.panel}
          isOpen={filtersOpen}
          onRequestClose={this.handleFiltersButtonClick}
          from="left">
          <Filters options={FILTERS} updateFilters={this.updateFilters} />
        </SlidingPane>
        <SlidingPane
          width="60%"
          className={styles.panel}
          isOpen={sortOpen}
          onRequestClose={this.handleSortButtonClick}
          from="right">
          Sort
        </SlidingPane>
      </div>
    )
  }
}

export default BikeSales
