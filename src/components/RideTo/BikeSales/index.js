import React, { Component } from 'react'
import Modal from 'react-modal'
import styles from './styles.scss'
import BikeSummary from './BikeSummary'
import Sort from './Sort'
import Filters from './Filters'
import 'react-sliding-pane-spread-props/dist/react-sliding-pane.css'
import { isEqual } from 'lodash'
import MySlidingPane from './MySlidingPane'
import {
  SORT_OPTIONS,
  sortFunctions,
  getFiltersCount,
  reduceFilters
} from 'services/bike-sales.js'
import Pagination from 'rc-pagination'
import en_GB from 'rc-pagination/es/locale/en_GB.js'

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
    name: `${i} ${bike.name}`
  }))
  .sort(() => Math.random() - 0.5)

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
      sort: this.sortOptions[0],
      page: 1
    }

    this.closeFilters = this.closeFilters.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.updateBudget = this.updateBudget.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.handleFiltersButtonClick = this.handleFiltersButtonClick.bind(this)
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
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
      sort,
      page: 1
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

  handlePageChange(current, pageSize) {
    this.setState({
      page: current
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
      sort,
      page
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
              {bikes.slice(page * 9 - 9, page * 9).map((bike, i) => (
                <div className={styles.item} key={i}>
                  <BikeSummary bike={bike} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.paginationWrap}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .${
              styles.pagination
            } .rc-pagination-item-active { background-color: var(--primary-color); }
            .${
              styles.pagination
            } .rc-pagination-item-active a { color: white; cursor: default; }
            .${
              styles.pagination
            } .rc-pagination-item-active a:hover { color: white; }
            .${
              styles.pagination
            } [class^="rc-pagination-jump"] { pointer-events: none; outline: 0; }
            .${
              styles.pagination
            } [class^="rc-pagination-jump"] a::before { content: "..." }
          `
            }}
          />
          <Pagination
            className={styles.pagination}
            current={page}
            total={Math.ceil(bikes.length)}
            pageSize={9}
            locale={en_GB}
            hideOnSinglePage={true}
            onChange={this.handlePageChange}
          />
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
