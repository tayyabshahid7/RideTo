import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import StaticSidePanel from 'components/StaticSidePanel'
import SearchInput from 'components/SearchInput'
import InvoicesTable from '../components/InvoicesTable'
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
          <InvoicesTable />
        </div>
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
