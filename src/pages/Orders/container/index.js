import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import SchoolSelect from 'components/SchoolSelect'
import PaginationLinks from 'components/PaginationLinks'
import { getDateFilters } from 'services/order'
import { changeSchool } from 'store/auth'
import * as orderModule from 'store/order'
import { Button } from 'components/ConnectForm'

import Loading from 'components/Loading'
import StaticSidePanel from 'components/StaticSidePanel'
import SearchInput from 'components/SearchInput'
import OrdersTable from 'pages/Orders/components/OrdersTable'
import OrdersRadioFilter from 'pages/Orders/components/OrdersRadioFilter'
import OrdersMultiFilter from 'pages/Orders/components/OrdersMultiFilter'
import styles from './styles.scss'
import commonStyles from '../../styles.scss'

function Orders({ orders, total, supplierId, user, changeSchool, isFetching }) {
  const [filterChanged, setFilterChanged] = useState(false)
  const [dateFilter, setDateFilter] = useState(null)
  const [locationFilter, setLocationFilter] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const dateFilters = [
    { text: 'Today', value: 'today' },
    { text: 'All Time', value: 'all' },
    { text: 'This Week', value: 'week' },
    { text: 'This Month', value: 'month' },
    { text: 'This Year', value: 'year' }
  ]

  const locationFilters = [
    { text: 'RideTo Demo School', value: 0 },
    { text: 'RideTo London School', value: 1 },
    { text: 'Orpington School', value: 2 }
  ]

  const courseFilters = [
    { text: 'Course 1', value: 0 },
    { text: 'Course 2', value: 1 },
    { text: 'Course 3', value: 2 },
    { text: 'Course 4', value: 3 }
  ]

  const statusFilters = [
    { text: 'Confirmed', value: 'confirmed' },
    { text: 'Pending', value: 'pending' },
    { text: 'Cancelled', value: 'cancelled' },
    { text: 'Completed', value: 'completed' },
    { text: 'Not Completed', value: 'not_completed' },
    { text: 'Not Attended', value: 'not_attended' }
  ]

  // constructor(props) {
  //   super(props)
  //   this.handleChangePage = this.handleChangePage.bind(this)
  //   this.handleSorting = this.handleSorting.bind(this)
  //   this.handleDateFilter = this.handleDateFilter.bind(this)
  //   this.handleSearch = this.handleSearch.bind(this)

  //   this.state = {
  //     page: 1,
  //     ordering: null,
  //     search: null,
  //     dateFilter: getDateFilters()[3]
  //   }
  // }

  // componentDidUpdate(oldProps) {
  //   if (oldProps.supplierId !== this.props.supplierId) {
  //     this.fetchOrders()
  //   }
  // }

  // componentDidMount() {
  //   this.fetchOrders()
  // }

  // fetchOrders() {
  //   const { supplierId } = this.props
  //   const { dateFilter, search, ordering, page } = this.state
  //   const sdate = dateFilter.getStartDate()
  //   const edate = dateFilter.getEndDate()
  //   const params = { sdate, edate, search, page, ordering }

  //   this.props.fetchSupplierOrders(supplierId, params)
  // }

  // handleChangePage(page) {
  //   this.setState({ page }, () => this.fetchOrders())
  // }

  // handleSorting(ordering) {
  //   this.setState({ ordering }, () => this.fetchOrders())
  // }

  // handleDateFilter(dateFilter) {
  //   this.setState({ dateFilter }, () => {
  //     this.fetchOrders()
  //   })
  // }

  // handleSearch(search) {
  //   this.setState({ search }, () => {
  //     this.fetchOrders()
  //   })
  // }

  const handleSorting = () => {}

  const handleClearFilter = () => {
    setDateFilter(null)
    setLocationFilter(null)
    setSelectedStatuses([])
    setSelectedCourses([])
  }

  const handleApplyFilter = () => {
    setFilterChanged(false)
  }

  const handleFilterChanged = () => {
    setFilterChanged(true)
  }

  const handleDateFilter = filter => {
    setDateFilter(filter)
    handleFilterChanged()
  }

  const handleLocationFilter = filter => {
    setLocationFilter(filter)
    handleFilterChanged()
  }

  const handleCourseSelect = filter => {
    let tmp = selectedCourses.slice()
    if (selectedCourses.includes(filter)) {
      tmp = tmp.filter(x => x !== filter)
    } else {
      tmp.push(filter)
    }
    setSelectedCourses(tmp)
    handleFilterChanged()
  }

  const handleStatusSelect = filter => {
    let tmp = selectedStatuses.slice()
    if (selectedStatuses.includes(filter)) {
      tmp = tmp.filter(x => x !== filter)
    } else {
      tmp.push(filter)
    }
    setSelectedStatuses(tmp)
    handleFilterChanged()
  }

  const onSearch = () => {}

  return (
    <div className={styles.container}>
      <StaticSidePanel>
        <SearchInput placeholder="e.g. order #" onSearch={onSearch} />
        <div className={styles.divider}></div>
        <OrdersRadioFilter
          title="Training Date"
          filters={dateFilters}
          selectedFilter={dateFilter}
          onSelect={handleDateFilter}
        />
        <div className={styles.divider}></div>
        <OrdersRadioFilter
          title="Location"
          filters={locationFilters}
          selectedFilter={locationFilter}
          onSelect={handleLocationFilter}
        />
        <div className={styles.divider}></div>
        <OrdersMultiFilter
          title="Course"
          filters={courseFilters}
          selectedFilters={selectedCourses}
          onSelect={handleCourseSelect}
        />
        <div className={styles.divider}></div>
        <OrdersMultiFilter
          title="Order Status"
          filters={statusFilters}
          selectedFilters={selectedStatuses}
          onSelect={handleStatusSelect}
        />
        <div className={styles.divider}></div>
        <div className={styles.filterActions}>
          <Button
            color="primary"
            className={styles.filterButton}
            onClick={handleApplyFilter}>
            Apply Filters
          </Button>
          <Button
            color="white"
            className={styles.filterButton}
            onClick={handleClearFilter}>
            Clear Filters
          </Button>
        </div>
      </StaticSidePanel>
      <div className={styles.tableContainer}>
        <OrdersTable
          loading={isFetching}
          orders={orders}
          sortingChange={handleSorting}
        />
      </div>
      {filterChanged && (
        <div className={styles.floatingApply}>
          <i className={styles.exclamation}>!</i>
          <span>Click 'Apply Filters' to refresh results</span>
          <Button color="white" onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </div>
      )}
      {/* <div
          className={classnames(
            styles.ordersContainer,
            commonStyles.mainContent
          )}>
          <h1>Orders</h1>
          <div style={{ maxWidth: '400px' }}>
            <SchoolSelect
              selected={supplierId}
              schools={user.suppliers}
              onChange={changeSchool}
            />
          </div>
          <div className={styles.orderFilters}>
            <div className={styles.sortByTraining}>Sort by training date</div>
            <OrderFilters
              filters={getDateFilters()}
              selectedFilter={dateFilter}
              onDateFilter={this.handleDateFilter}
              onSearch={this.handleSearch}
            />
          </div>
          <Loading loading={isFetching}>
            {orders.length > 0 ? (
              <React.Fragment>
                <ConfirmedOrders
                  loading={isFetching}
                  confirmedOrders={orders}
                  sortingChange={this.handleSorting}
                />
                <PaginationLinks
                  currentPage={page}
                  count={total}
                  pageSize={15}
                  rowName={'orders'}
                  onPageChange={this.handleChangePage}
                />
              </React.Fragment>
            ) : (
              <div className={styles.noResults}>
                No orders yet. No worries we have your back! ;)
              </div>
            )}
          </Loading>
        </div> */}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  const supplierId = parseInt(state.auth.schoolId, 10)
  const { total, isFetching } = state.order

  return {
    supplierId,
    total,
    isFetching,
    user: state.auth.user,
    schoolName: state.auth.schoolName,
    orders: orderModule.selectors.getItems(state.order)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool,
      ...orderModule.actions
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
