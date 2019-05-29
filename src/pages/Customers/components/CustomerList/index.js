import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
import Cell from 'components/DataTable/Cell'
import Loading from 'components/Loading'

const getDisplaySource = ({ source }) => {
  return source === 'RIDETO' || source === 'RIDETO_INSTANT'
    ? 'RideTo'
    : 'Direct'
}

const CustomerList = ({ customers, ordering, isLoading, onSort }) => {
  return (
    <Loading loading={isLoading}>
      <table
        className={classnames(
          commonStyles.dataTable,
          'table table-responsive-sm'
        )}>
        <thead>
          <tr>
            <Header column="first_name" ordering={ordering} onSort={onSort}>
              Name
            </Header>
            <Header column="phone" ordering={ordering} onSort={onSort}>
              Phone
            </Header>
            <Header column="source" ordering={ordering} onSort={onSort}>
              Source
            </Header>
            <Header>Latest Order</Header>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <Cell>
                <Link to={`/customers/${customer.id}`}>
                  {customer.first_name} {customer.last_name}
                </Link>
              </Cell>
              <Cell>{customer.phone}</Cell>
              <Cell>{getDisplaySource(customer)}</Cell>
              <Cell>{customer.orders[0] || ''}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </Loading>
  )
}

export default CustomerList
