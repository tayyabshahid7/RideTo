import React, { Component } from 'react'
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

const statusOptions = [
  { text: 'All Invoicse', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Partially Paid', value: 'partial' },
  { text: 'Outstanding', value: 'outstanding' },
  { text: 'Overdue', value: 'overdue' }
]

class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidUpdate(oldProps) {
    this.fetchOrders()
  }

  componentDidMount() {
    this.fetchOrders()
  }

  onSearch = value => {
    console.log(value)
  }

  handleChangeStatus = status => {
    status.checked = !status.checked
  }

  fetchOrders() {}

  render() {
    const { location, history, match } = this.props

    return (
      <div className={styles.container}>
        <StaticSidePanel>
          <SearchInput placeholder="e.g. invoice #" onSearch={this.onSearch} />
          <div className={styles.divider}></div>
          <h5 className={styles.sectionTitle}>Invoice Status</h5>
          {statusOptions.map((status, index) => (
            <div className={styles.sectionItem} key={index}>
              <h6 className={styles.sectionLabel}>{status.text}</h6>
              <label className="cross-check">
                <input
                  type="checkbox"
                  checked={status.checked}
                  onChange={() => this.handleChangeStatus(status)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
          <div className={styles.divider}></div>
          <Button type="submit" color="primary" className={styles.filterButton}>
            Apply Filters
          </Button>
        </StaticSidePanel>
        <div className={styles.tableContainer}>
          <InvoicesTable location={location} history={history} match={match} />
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
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
