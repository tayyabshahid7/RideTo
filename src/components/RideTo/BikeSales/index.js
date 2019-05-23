import React, { Component } from 'react'
import Modal from 'react-modal'
import styles from './styles.scss'
import BikeSummary from './BikeSummary'
import Sort from './Sort'
import Filters from './Filters'
import 'react-sliding-pane-spread-props/dist/react-sliding-pane.css'
import { isEqual } from 'lodash'
import MySlidingPane from './MySlidingPane'

const DUMMY_DATA = [
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

const FILTERS = [
  {
    name: 'Brand',
    values: ['BMW', 'Ducati', 'Honda', 'Susuki']
  },
  {
    name: 'Engine',
    values: ['50cc', '125cc', '200cc', '300cc', '400cc', '2000cc']
  },
  {
    name: 'Style',
    values: ['Adventure', 'Classic', 'Scooter', 'Super Moto']
  },
  {
    name: 'Budget',
    values: []
  },
  {
    name: 'Licence',
    values: ['CBT', 'A1 Licence', 'A2 Licence', 'A Licence']
  }
]

const SORT_OPTIONS = [
  { name: 'Reviews', id: 'reviews' },
  { name: 'Price (Low to High)', id: 'priceAsc' },
  { name: 'Price (High to Low)', id: 'priceDesc' },
  { name: 'Make (A-Z)', id: 'aToZ' }
]

const sortFunctions = {
  reviews: (a, b) => (a.reviews < b.reviews ? 1 : -1),
  priceAsc: (a, b) => (a.price > b.price ? 1 : -1),
  priceDesc: (a, b) => (a.price < b.price ? 1 : -1),
  aToZ: (a, b) => (a.categories.brand > b.categories.brand ? 1 : -1)
}

function getFiltersCount(filters, budgetMin, budgetMax) {
  let count = Object.values(filters).reduce((count, values) => {
    return values === 'All' ? count : count + values.length
  }, 0)

  if (budgetMin || budgetMax) {
    ++count
  }

  return count
}

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

    this.defaultFilters = FILTERS.map(option => ({
      ...option,
      values: option.values.map(value => ({
        name: value,
        active: false
      }))
    }))
    this.defaultReducedFilters = reduceFilters(FILTERS)
    this.sortOptions = SORT_OPTIONS

    this.state = {
      filtersOpen: false,
      sortOpen: false,
      bikes: DUMMY_DATA.sort(sortFunctions[this.sortOptions[0].id]),
      filters: this.defaultFilters,
      reducedFilters: this.defaultReducedFilters,
      budgetMin: null,
      budgetMax: null,
      sort: this.sortOptions[0]
    }

    this.closeFilters = this.closeFilters.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.updateBudget = this.updateBudget.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.handleFiltersButtonClick = this.handleFiltersButtonClick.bind(this)
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this)
  }

  componentDidMount() {
    Modal.setAppElement(document.getElementById('bike-sales-root'))
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(this.state.filters, prevState.filters) ||
      this.state.budgetMin !== prevState.budgetMin ||
      this.state.budgetMax !== prevState.budgetMax ||
      this.state.sort.id !== prevState.sort.id
    ) {
      const reducedFilters = reduceFilters(this.state.filters)

      this.setState({
        bikes: DUMMY_DATA.filter(bike => {
          const min = !this.state.budgetMin ? 0 : this.state.budgetMin * 100
          const max = !this.state.budgetMax
            ? Infinity
            : this.state.budgetMax * 100

          if (bike.price > max || bike.price < min) {
            return false
          }

          return true
        })
          .filter(bike => {
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
          .sort(sortFunctions[this.state.sort.id]),
        reducedFilters
      })
    }
  }

  closeFilters() {
    this.setState({
      filtersOpen: false,
      sortOpen: false,
      budgetMin: null,
      budgetMax: null
    })
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

  clearFilters() {
    this.setState({
      filters: this.defaultFilters,
      reducedFilters: this.defaultReducedFilters,
      budgetMin: null,
      budgetMax: null
    })
  }

  updateBudget(type, value) {
    this.setState({
      [type]: value ? parseInt(value, 10) : 0
    })
  }

  updateSort(sort) {
    this.setState({
      sort
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
    const {
      filtersOpen,
      sortOpen,
      bikes,
      filters,
      reducedFilters,
      budgetMin,
      budgetMax,
      sort
    } = this.state

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
        <MySlidingPane
          closeFilters={this.closeFilters}
          isOpen={filtersOpen}
          onRequestClose={this.handleFiltersButtonClick}
          from="left"
          title="Filters"
          filtersCount={getFiltersCount(reducedFilters, budgetMin, budgetMax)}
          clearFilters={this.clearFilters}>
          <Filters
            options={filters}
            reducedFilters={reducedFilters}
            updateFilters={this.updateFilters}
            budgetMin={budgetMin}
            budgetMax={budgetMax}
            updateBudget={this.updateBudget}
          />
        </MySlidingPane>
        <MySlidingPane
          closeFilters={this.closeFilters}
          isOpen={sortOpen}
          onRequestClose={this.handleSortButtonClick}
          from="right"
          title="Sort">
          <Sort
            sortOptions={this.sortOptions}
            sortSelected={sort}
            updateSort={this.updateSort}
          />
        </MySlidingPane>
      </div>
    )
  }
}

export default BikeSales
