import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import SchoolSelect from 'components/SchoolSelect'
import PaginationLinks from 'components/PaginationLinks'
import { getDateFilters } from 'services/order'
import { changeSchool } from 'store/auth'
import * as orderModule from 'store/order'
import { Button } from 'components/ConnectForm'
import { getDateRangeByType } from 'common/info'

import LoadingMask from 'components/LoadingMask'
import StaticSidePanel from 'components/StaticSidePanel'
import SearchInput from 'components/SearchInput'
import OrdersTable from 'pages/Orders/components/OrdersTable'
import OrdersRadioFilter from 'pages/Orders/components/OrdersRadioFilter'
import OrdersMultiFilter from 'pages/Orders/components/OrdersMultiFilter'
import styles from './styles.scss'
import commonStyles from '../../styles.scss'

function Orders({
  orders,
  suppliers,
  info,
  total,
  user,
  changeSchool,
  fetchFilteredOrders,
  isFetching
}) {
  const [filterChanged, setFilterChanged] = useState(false)
  const [dateFilter, setDateFilter] = useState(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const dateFilters = [
    { text: 'Today', value: 'today' },
    { text: 'All Time', value: 'all' },
    { text: 'This Week', value: 'this week' },
    { text: 'This Month', value: 'this month' },
    { text: 'This Year', value: 'this year' }
  ]
  const supplierOptions = suppliers.map(x => ({
    text: x.name,
    value: x.id
  }))

  const courseFilters = info.courseTypes.map(x => ({
    text: x.name,
    value: x.constant
  }))

  const statusFilters = [
    { text: 'Confirmed', value: 'TRAINING_CONFIRMED' },
    { text: 'Failed', value: 'TRAINING_FAILED' },
    { text: 'Cancelled', value: 'TRAINING_CANCELLED' },
    {
      text: 'Waiting School Confirmation',
      value: 'TRAINING_WAITING_SCHOOL_CONFIRMATION'
    },
    {
      text: 'Waiting Rider Confirmation',
      value: 'TRAINING_WAITING_RIDER_CONFIRMATION'
    },
    { text: 'No Show', value: 'TRAINING_NO_SHOW' },
    { text: 'Passed', value: 'TRAINING_PASSED' },
    { text: 'Order Denined', value: 'TRAINING_ORDER_DENIED' }
  ]

  useEffect(() => {
    fetchOrders()
  }, [searchQuery, page])

  // useEffect(() => {
  //   console.log('*** fetching')
  //   console.log(fromDate, toDate)
  //   // const { supplierId } = this.props
  //   // const { dateFilter, search, ordering, page } = this.state
  //   // const sdate = dateFilter.getStartDate()
  //   // const edate = dateFilter.getEndDate()
  //   // const params = { sdate, edate, search, page, ordering }

  //   // this.props.fetchSupplierOrders(supplierId, params)
  // }, [fromDate, toDate, selectedSuppliers, selectedCourses, selectedStatuses])

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
    setSelectedSuppliers([])
    setSelectedStatuses([])
    setSelectedCourses([])
  }

  const handleApplyFilter = () => {
    setFilterChanged(false)
    setPage(1)
    fetchOrders()
  }

  const fetchOrders = () => {
    const params = {
      sdate: fromDate,
      edate: toDate,
      supplier_id: selectedSuppliers.join(','),
      course_type__constant: selectedCourses.join(','),
      status: selectedStatuses.join(','),
      search: searchQuery,
      page
    }

    fetchFilteredOrders(params)
  }

  const handleFilterChanged = () => {
    setFilterChanged(true)
  }

  const handleDateFilter = filter => {
    setDateFilter(filter)
    const { fromDate, toDate } = getDateRangeByType(filter)
    setFromDate(fromDate)
    setToDate(toDate)
    handleFilterChanged()
  }

  const handleSupplierSelect = filter => {
    let tmp = selectedSuppliers.slice()
    if (selectedSuppliers.includes(filter)) {
      tmp = tmp.filter(x => x !== filter)
    } else {
      tmp.push(filter)
    }
    setSelectedSuppliers(tmp)
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

  const onSearch = query => {
    setSearchQuery(query)
    setPage(1)
  }

  const onPage = page => {
    setPage(page)
  }

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
        <OrdersMultiFilter
          title="Location"
          filters={supplierOptions}
          selectedFilters={selectedSuppliers}
          onSelect={handleSupplierSelect}
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
          orders={orders.orders}
          total={orders.total}
          page={page}
          onPage={onPage}
          sortingChange={handleSorting}
        />
        <LoadingMask loading={orders.loading} />
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
    suppliers: state.auth.user.suppliers,
    info: state.info,
    // orders: orderModule.selectors.getItems(state.order)
    orders: state.order.orders
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
