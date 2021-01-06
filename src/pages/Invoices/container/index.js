import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import StaticSidePanel from 'components/StaticSidePanel'
// import SearchInput from 'components/SearchInput'
import InvoicesTable from '../components/InvoicesTable'
import NewPaymentSidebar from '../components/NewPaymentSidebar'
import InvoiceStatusSidebar from '../components/InvoiceStatusSidebar'
import InvoiceOrderDetail from '../components/InvoiceOrderDetail'
import RightPanel from 'components/RightPanel'
import { Button } from 'components/ConnectForm'
import OrdersRadioFilter from 'pages/Orders/components/OrdersRadioFilter'

import LoadingMask from 'components/LoadingMask'
import { deleteInvoice } from 'services/invoice'
import { actions as notifyActions } from 'store/notification'
import { getInvoices } from 'store/invoice'
import { actions as orderActions } from 'store/order'
// import { debounce } from 'lodash'

const statusOptions = [
  { text: 'All Invoices', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Draft', value: 'draft' },
  { text: 'Open', value: 'open' },
  { text: 'Uncollectible', value: 'uncollectible' },
  { text: 'Void', value: 'void' }
]
const pageSize = 25

function Invoices({
  location,
  history,
  match,
  invoices,
  loadedAll,
  loading,
  showNotification,
  getInvoices,
  setInvoiceOrderId
}) {
  // const [searchQuery, setSearchQuery] = useState('')
  // const [searchInputValue, setSearchInputValue] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  // const handleSearchChange = query => {
  //   setSearchInputValue(query)
  //   onSearch(query)
  // }

  // const onSearch = useCallback(
  //   debounce(query => {
  //     setSearchQuery(query)
  //   }, 500),
  //   []
  // )

  const fetchInvoices = invoiceId => {
    const params = {
      limit: pageSize,
      // search: searchQuery,
      status: selectedStatus,
      // TODO: support multiple status by backend
      starting_after: invoiceId
    }
    getInvoices(params)
  }

  const handleSelectStatus = filter => {
    setSelectedStatus(filter)
  }

  const handleApplyFilter = () => {
    fetchInvoices()
  }

  const onLoadMore = () => {
    if (!invoices.length) {
      return
    }
    const lastInvoice = invoices.slice(-1)[0].id
    fetchInvoices(lastInvoice)
  }

  const handleDelete = async invoice => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setDeleting(true)
      try {
        await deleteInvoice(invoice.id)
        setDeleting(false)
        fetchInvoices()
      } catch (err) {
        showNotification('Error', 'Failed to delete an invoice', 'danger')
      }
    }
  }

  return (
    <div className={styles.container}>
      <StaticSidePanel>
        {/* <SearchInput
          value={searchInputValue}
          placeholder="e.g. invoice #"
          onChange={handleSearchChange}
        />
        <div className={styles.divider}></div> */}
        <OrdersRadioFilter
          title="Invoice Status"
          filters={statusOptions}
          selectedFilter={selectedStatus}
          onSelect={handleSelectStatus}
        />
        <div className={styles.divider}></div>
        <Button
          type="submit"
          color="primary"
          className={styles.filterButton}
          onClick={handleApplyFilter}>
          Apply Filters
        </Button>
      </StaticSidePanel>
      <div className={styles.tableContainer}>
        <InvoicesTable
          invoices={invoices}
          location={location}
          history={history}
          match={match}
          loadedAll={loadedAll}
          onRefresh={fetchInvoices}
          showNotification={showNotification}
          onDelete={handleDelete}
          onLoadMore={onLoadMore}
          setUpdating={setUpdating}
          setInvoiceOrderId={setInvoiceOrderId}
        />

        <LoadingMask loading={loading || updating || deleting} />
      </div>
      <RightPanel location={location} type="full">
        <Route
          exact
          path="/invoices/new-payment/:id"
          render={routeProps => (
            <NewPaymentSidebar history={history} {...routeProps} />
          )}
        />
        <Route
          exact
          path="/invoices/edit/:id"
          render={routeProps => <NewPaymentSidebar {...routeProps} />}
        />
        <Route
          exact
          path="/invoices/status/:id"
          render={routeProps => <InvoiceStatusSidebar {...routeProps} />}
        />
        <Route
          exact
          path="/invoices/orders/edit/:id"
          render={routeProps => (
            <InvoiceOrderDetail
              {...routeProps}
              isEdit={true}
              isInvoice={true}
            />
          )}
        />
      </RightPanel>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    invoices: state.invoice.invoices,
    loadedAll: state.invoice.loadedAll,
    loading: state.invoice.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInvoices,
      setInvoiceOrderId: orderActions.setInvoiceOrderId,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invoices)
