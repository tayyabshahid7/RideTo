import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import StaticSidePanel from 'components/StaticSidePanel'
import SearchInput from 'components/SearchInput'
import InvoicesTable from '../components/InvoicesTable'
import NewPaymentSidebar from '../components/NewPaymentSidebar'
import RightPanel from 'components/RightPanel'
import { Button } from 'components/ConnectForm'
import { getInvoices } from 'store/invoice'
import OrdersRadioFilter from 'pages/Orders/components/OrdersRadioFilter'
import LoadingMask from 'components/LoadingMask'

const statusOptions = [
  { text: 'All Invoicse', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Draft', value: 'draft' },
  { text: 'Open', value: 'open' },
  { text: 'Uncollectible', value: 'uncollectible' },
  { text: 'Void', value: 'void' }
]

function Invoices({
  location,
  history,
  match,
  invoices,
  loading,
  getInvoices
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchInvoices()
  }, [searchQuery, page])

  const onSearch = query => {
    setSearchQuery(query)
    setPage(1)
  }

  const fetchInvoices = () => {
    const params = {
      page,
      search: searchQuery,
      status: selectedStatus
    }
    getInvoices(params)
  }

  const handleSelectStatus = filter => {
    setSelectedStatus(filter)
  }

  const handleApplyFilter = () => {
    setPage(1)
    fetchInvoices()
  }

  return (
    <div className={styles.container}>
      <StaticSidePanel>
        <SearchInput
          value={searchQuery}
          placeholder="e.g. invoice #"
          onSearch={onSearch}
        />
        <div className={styles.divider}></div>
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
          onRefresh={fetchInvoices}
        />
        <LoadingMask loading={loading} />
      </div>
      <RightPanel location={location} type="full">
        <Route
          exact
          path="/invoices/new-payment"
          render={routeProps => (
            <NewPaymentSidebar history={history} {...routeProps} />
          )}
        />
        <Route
          exact
          path="/invoices/edit/:id "
          render={routeProps => <NewPaymentSidebar {...routeProps} />}
        />
      </RightPanel>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    invoices: state.invoice.invoices,
    loading: state.invoice.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInvoices
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invoices)
