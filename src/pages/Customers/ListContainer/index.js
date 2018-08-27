import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import commonStyles from 'pages/styles.scss'
import CustomerList from 'pages/Customers/components/CustomerList'
import PaginationLinks from 'components/PaginationLinks'
import { actions, selectors } from 'store/customer'

class CustomerListContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ordering: '-updated_at'
    }

    this.handleSort = this.handleSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentDidMount() {
    this.fetchCustomers()
  }

  fetchCustomers() {
    const { ordering, page } = this.state
    this.props.fetchCustomers({ ordering, page })
  }

  handleSort(ordering) {
    this.setState({ ordering }, () => this.fetchCustomers())
  }

  handleChangePage(page) {
    this.setState({ page, loading: true }, () => this.fetchCustomers())
  }

  render() {
    const { customers, total, isFetching } = this.props
    const { ordering, page } = this.state

    return (
      <div className={commonStyles.mainContent}>
        <h1>Customers</h1>
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
