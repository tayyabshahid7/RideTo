import React from 'react'

import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
import Cell from 'components/DataTable/Cell'
import Loading from 'components/Loading'

const getDisplaySource = ({ source }) => {
  return source === 'RIDETO' ? 'RideTo' : 'Direct'
}

const getDispalyOrder = ({ source, orders = [] }) => {
  const order = orders[0]

  return source === 'RIDETO'
    ? `#${order.friendly_id}`
    : `DIRECT #${order.friendly_id}`
}

class CustomerList extends React.Component {
  render() {
    const { customers, ordering, isLoading, onSort } = this.props

    return (
      <Loading loading={isLoading}>
        <table className={commonStyles.dataTable}>
          <thead>
            <tr>
              <Header column="last_name" ordering={ordering} onSort={onSort}>
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
                  {customer.first_name} {customer.last_name}
                </Cell>
                <Cell>{customer.phone}</Cell>
                <Cell>{getDisplaySource(customer)}</Cell>
                <Cell>{getDispalyOrder(customer)}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </Loading>
    )
  }
}

export default CustomerList
