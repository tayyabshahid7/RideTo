import React from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'

import styles from './ListContainer.scss'
import CustomerList from 'pages/Customers/components/CustomerList'
import SearchField from 'components/SearchField'
import PaginationLinks from 'components/PaginationLinks'
import { actions, selectors } from 'store/customer'

class CustomerListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ordering: '-updated_at',
      search: null
    }

    this.handleSort = this.handleSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
  }

  componentDidMount() {
    this.fetchCustomers()
  }

  fetchCustomers() {
    const { ordering, page, search } = this.state
    this.props.fetchCustomers({ ordering, page, search })
  }

  handleSort(ordering) {
    this.setState({ ordering }, () => this.fetchCustomers())
  }

  handleChangePage(page) {
    this.setState({ page, loading: true }, () => this.fetchCustomers())
  }

  handleSearch(search) {
    this.setState({ search, loading: true }, () => {
      this.fetchCustomers()
    })
  }

  render() {
    const { customers, total, isFetching } = this.props
    const { ordering, page } = this.state

    return (
      <div className={styles.listContainer}>
        <h1>Customer Information</h1>
        <div className={styles.heading}>
          <div className={styles.search}>
            <SearchField
              onSearch={this.handleSearch}
              placeholder="Search by Name, Order, Phone"
            />
          </div>
          <Button color="primary" tag={Link} to="/customers/create">
            Create Customer
          </Button>
        </div>
        <div>
          <CustomerList
            customers={customers}
            ordering={ordering}
            onSort={this.handleSort}
            isLoading={isFetching}
          />

          <PaginationLinks
            currentPage={page}
            count={total}
            pageSize={15}
            rowName={'orders'}
            onPageChange={this.handleChangePage}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    customers: selectors.getItems(state.customer),
    total: state.customer.total,
    isFetching: state.customer.isFetching
  }
}

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(actions, dispatch)
)(CustomerListContainer)
