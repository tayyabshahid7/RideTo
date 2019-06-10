import React, { Component, Fragment } from 'react'
import Modal from 'react-modal'
import styles from '../styles.scss'
import BikeSummary from '../BikeSummary'
import Sort from '../Sort'
import Filters from '../Filters'
import 'react-sliding-pane-spread-props/dist/react-sliding-pane.css'
import { isEqual } from 'lodash'
import MySlidingPane from '../MySlidingPane'
import {
  SORT_OPTIONS,
  CATEGORIES,
  DEFAULT_FILTERS,
  sortFunctions,
  getFiltersCount,
  reduceFilters
} from 'services/bike-sales'
import Pagination from 'rc-pagination'
import en_GB from 'rc-pagination/es/locale/en_GB.js'
import MediaQuery from 'react-responsive'

class BikeSalesListing extends Component {
  constructor(props) {
    super(props)

    this.sortOptions = SORT_OPTIONS

    this.state = {
      filtersOpen: false,
      sortOpen: false,
      bikes: [],
      filters: [],
      reducedFilters: {},
      budgetMin: null,
      budgetMax: null,
      sort: this.sortOptions[0],
      page: 1,
      loading: true
    }

    this.closeFilters = this.closeFilters.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.updateBudget = this.updateBudget.bind(this)
    this.updateSort = this.updateSort.bind(this)
    this.handleFiltersButtonClick = this.handleFiltersButtonClick.bind(this)
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount() {
    this.init()
    Modal.setAppElement(document.getElementById('bike-sales-root'))
  }

  init() {
    const { bikes } = this.props

    if (!bikes.length) {
      return
    }

    const filters = DEFAULT_FILTERS.map(filter => {
      if (filter.name === 'Budget') {
        return filter
      }

      const options = bikes.reduce((arr, bike) => {
        return [...arr, bike[filter.name.toLowerCase()]]
      }, [])

      return {
        ...filter,
        values: [...new Set(options)].sort()
      }
    })

    this.defaultFilters = filters.map(option => ({
      ...option,
      values: option.values.map(value => ({
        name: value,
        active: false
      }))
    }))
    this.defaultReducedFilters = reduceFilters(filters)

    this.setState({
      bikes: bikes.sort(sortFunctions[this.sortOptions[0].id]),
      filters: this.defaultFilters,
      reducedFilters: this.defaultReducedFilters,
      loading: false
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.bikes.length !== prevProps.bikes.length) {
      this.init()
    }

    if (
      !isEqual(this.state.filters, prevState.filters) ||
      this.state.budgetMin !== prevState.budgetMin ||
      this.state.budgetMax !== prevState.budgetMax ||
      this.state.sort.id !== prevState.sort.id
    ) {
      const reducedFilters = reduceFilters(this.state.filters)

      this.setState({
        bikes: this.props.bikes
          .filter(bike => {
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
            return Object.entries(bike)
              .filter(([name]) => CATEGORIES.includes(name))
              .every(([name, value]) => {
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
      page,
      loading
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
              Results:{' '}
              {loading
                ? 'Loading...'
                : `${bikes.length} bike${bikes.length > 1 ? 's' : ''} found`}
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
        <MediaQuery minWidth={600}>
          {matches => {
            return (
              <Fragment>
                <MySlidingPane
                  width={matches ? '60%' : '100%'}
                  closeFilters={this.closeFilters}
                  isOpen={filtersOpen}
                  onRequestClose={this.handleFiltersButtonClick}
                  from="left"
                  title="Filters"
                  filtersCount={getFiltersCount(
                    reducedFilters,
                    budgetMin,
                    budgetMax
                  )}
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
                  width={matches ? undefined : '100%'}
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
              </Fragment>
            )
          }}
        </MediaQuery>
      </div>
    )
  }
}

export default BikeSalesListing
