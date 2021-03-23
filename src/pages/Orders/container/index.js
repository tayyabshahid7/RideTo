import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'
import * as orderModule from 'store/order'
import { Button } from 'components/ConnectForm'
import { getDateRangeByType } from 'common/info'
import { CSVLink } from 'react-csv'
import _ from 'lodash'
import moment from 'moment'

import LoadingMask from 'components/LoadingMask'
import StaticSidePanel from 'components/StaticSidePanel'
import SearchInput from 'components/SearchInput'
import OrdersTable from 'pages/Orders/components/OrdersTable'
import OrdersRadioFilter from 'pages/Orders/components/OrdersRadioFilter'
import OrdersMultiFilter from 'pages/Orders/components/OrdersMultiFilter'
import RightPanel from 'components/RightPanel'
import styles from './styles.scss'
import OrdersDetailPanel from '../components/OrdersDetailPanel'
import { actions as notifyActions } from 'store/notification'
import { exportOrdersCsv } from 'services/order'

const pageSize = 50

const headers = [
  { label: 'ATB Number', key: 'atb_number' },
  { label: 'Certificate number', key: 'certificate_number' },
  { label: 'Completion Date', key: 'completion_date' },
  { label: 'Completion Time', key: 'completion_time' },
  { label: 'Course Duration', key: 'course_duration' },
  { label: 'Driver Number', key: 'driver_number' },
  { label: 'Instructor Certificate', key: 'instructor_certificate' },
  { label: 'Restriction', key: 'restriction' },
  { label: 'Transmission', key: 'transmission' }
  // { label: 'Validation', key: 'validation' }
  // { label: 'IN List', key: '' },
  // { label: 'IC List', key: '' },
  // { label: '', key: '' },
]

function Orders({
  orders,
  suppliers,
  info,
  location,
  history,
  match,
  fetchFilteredOrders,
  loadOrderState,
  resetOrderParamsLoaded,
  params,
  paramLoaded,
  showNotification,
  isFetching
}) {
  const [filterChanged, setFilterChanged] = useState(false)
  const [dateFilter, setDateFilter] = useState(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [ordering, setOrdering] = useState('')
  const [orderDir, setOrderDir] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [tags, setTags] = useState([])
  const [paramsRefreshed, setParamsRefreshed] = useState(false)
  const [exportData, setExportData] = useState([])

  const csvLinkEl = useRef()

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
    { text: 'Cancelled', value: 'TRAINING_CANCELLED' },
    { text: 'Not Completed', value: 'TRAINING_FAILED' },
    { text: 'Completed', value: 'TRAINING_PASSED' },
    { text: 'Not Attended', value: 'TRAINING_NO_SHOW' }
  ]

  useEffect(() => {
    loadOrderState()

    return () => {
      resetOrderParamsLoaded()
    }
  }, [])

  useEffect(() => {
    if (paramLoaded) {
      setDateFilter(params.dateFilter)
      if (params.supplier_id) {
        setSelectedSuppliers(
          _.intersection(
            params.supplier_id.split(',').map(x => parseInt(x)),
            supplierOptions.map(x => x.value)
          )
        )
      }
      if (params.course_type__constant) {
        setSelectedCourses(
          _.intersection(
            params.course_type__constant.split(','),
            courseFilters.map(x => x.value)
          )
        )
      }
      if (params.status) {
        if (params.status.split(',').length !== statusFilters.length) {
          setSelectedStatuses(
            _.intersection(
              params.status.split(','),
              statusFilters.map(x => x.value)
            )
          )
        }
      }
      setSearchQuery(params.search)
      setSearchInputValue(params.search)
      setToDate(params.edate)
      setFromDate(params.sdate)
      if (params.ordering) {
        if (params.ordering.startsWith('-')) {
          setOrdering(params.ordering.substr(1))
          setOrderDir('-')
        } else {
          setOrdering(params.ordering)
          setOrderDir('')
        }
      }
      setParamsRefreshed(true)
    }
  }, [paramLoaded])

  const getTags = () => {
    const data = []
    if (dateFilter) {
      const tmp = dateFilters.find(x => x.value === dateFilter)
      if (tmp) {
        data.push(tmp.text)
      }
    }
    if (selectedSuppliers.length) {
      selectedSuppliers.forEach(sup => {
        const tmp = supplierOptions.find(x => x.value === sup)
        if (tmp) {
          data.push(tmp.text)
        }
      })
    }
    if (selectedCourses.length) {
      selectedCourses.forEach(course => {
        const tmp = courseFilters.find(x => x.value === course)
        if (tmp) {
          data.push(tmp.text)
        }
      })
    }
    if (selectedStatuses.length) {
      selectedStatuses.forEach(st => {
        const tmp = statusFilters.find(x => x.value === st)
        if (tmp) {
          data.push(tmp.text)
        }
      })
    }
    return data
  }

  useEffect(() => {
    if (paramLoaded) {
      fetchOrders()
    }
  }, [searchQuery, page, paramsRefreshed, ordering, orderDir])

  const handleClearFilter = () => {
    setPage(1)
    setDateFilter(null)
    setSelectedSuppliers([])
    setSelectedStatuses([])
    setSelectedCourses([])
    setSearchQuery('')
    setSearchInputValue('')
    setShowFilter(false)

    const params = {
      page_size: pageSize,
      page: 1
    }

    handleFetch(params)
  }

  const handleApplyFilter = () => {
    setFilterChanged(false)
    setPage(1)
    fetchOrders()
    setShowFilter(false)
  }

  const generateParams = () => {
    const params = {
      sdate: fromDate,
      edate: toDate,
      supplier_id: selectedSuppliers.join(','),
      course_type__constant: selectedCourses.join(','),
      search: searchQuery,
      page_size: pageSize,
      dateFilter,
      page
    }

    if (selectedStatuses.length) {
      params.status = selectedStatuses.join(',')
    } else {
      params.status = statusFilters.map(x => x.value).join(',')
    }

    return params
  }

  const fetchOrders = () => {
    const params = generateParams()
    handleFetch(params)
    setTags(getTags())
  }

  const onExportCsv = async () => {
    let filename =
      moment().format('hh:mm MM-DD-YY') + ' ConnectMCT Order Export.xlsx'

    if (selectedSuppliers.length === 1) {
      const supplier = suppliers.find(x => x.id === selectedSuppliers[0])
      filename = supplier.name + ' ' + filename
    }

    const params = generateParams()
    const result = await exportOrdersCsv(params)

    const blob = new Blob([result], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    })
    const element = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    element.href = href
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    window.URL.revokeObjectURL(href)

    // setExportData(result)
    // setTimeout(() => {
    //   csvLinkEl.current.link.click()
    // })
  }

  const handleFetch = orderParams => {
    if (ordering) {
      orderParams.ordering = orderDir + ordering
    }

    fetchFilteredOrders(orderParams)
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

  const handleSearchChange = query => {
    setSearchInputValue(query)
    onSearch(query)
  }

  const onSearch = useCallback(
    _.debounce(query => {
      setSearchQuery(query)
      setPage(1)
    }, 500),
    []
  )

  const onSort = (field, asc) => {
    setOrdering(field)
    setOrderDir(asc ? '' : '-')
    setPage(1)
  }

  const onPage = page => {
    setPage(page)
  }

  const onRefresh = () => {
    fetchOrders()
  }

  const onToggleFilter = flag => {
    setShowFilter(flag)
  }

  return (
    <div className={styles.container}>
      <StaticSidePanel
        title="Filter"
        show={showFilter}
        onClose={() => onToggleFilter(false)}>
        <SearchInput
          value={searchInputValue}
          placeholder="e.g. order #"
          onChange={handleSearchChange}
        />
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
        <div className="d-none">
          <CSVLink
            headers={headers}
            filename="order-data.csv"
            data={exportData}
            ref={csvLinkEl}
          />
        </div>
        <OrdersTable
          location={location}
          history={history}
          match={match}
          loading={isFetching}
          orders={orders.orders}
          total={orders.total}
          ordering={ordering}
          orderDir={orderDir}
          tags={tags}
          page={page}
          onPage={onPage}
          onSort={onSort}
          onExportCsv={onExportCsv}
          onRefresh={onRefresh}
          searchInputValue={searchInputValue}
          onSearchChange={handleSearchChange}
          showNotification={showNotification}
          onOpenFilter={() => onToggleFilter(true)}
          pageSize={pageSize}
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
        <Route
          exact
          path="/orders/pay/:id"
          render={routeProps => (
            <OrdersDetailPanel
              {...routeProps}
              isPayment={true}
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
    orders: state.order.orders,
    params: state.order.orders.params,
    paramLoaded: state.order.orders.paramLoaded
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeSchool,
      ...orderModule.actions,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
