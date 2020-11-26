import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
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
import RightPanel from 'components/RightPanel'
import styles from './styles.scss'
import OrdersDetailPanel from '../components/OrdersDetailPanel'

function Orders({
  orders,
  suppliers,
  info,
  location,
  history,
  match,
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
          location={location}
          history={history}
          match={match}
          loading={isFetching}
          orders={orders.orders}
          total={orders.total}
          page={page}
          onPage={onPage}
          sortingChange={handleSorting}
        />
        <LoadingMask loading={orders.loading} />
      </div>
      <RightPanel location={location} type="full">
        <Route
          exact
          path="/orders/detail/:id"
          render={routeProps => (
            <OrdersDetailPanel {...routeProps} orders={orders.orders} />
          )}
        />
        <Route
          exact
          path="/orders/edit/:id"
          render={routeProps => (
            <OrdersDetailPanel
              {...routeProps}
              isEdit={true}
              orders={orders.orders}
            />
          )}
        />
      </RightPanel>
      {filterChanged && (
        <div className={styles.floatingApply}>
          <i className={styles.exclamation}>!</i>
          <span>Click 'Apply Filters' to refresh results</span>
          <Button color="white" onClick={handleApplyFilter}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user,
    suppliers: state.auth.user.suppliers,
    info: state.info,
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
