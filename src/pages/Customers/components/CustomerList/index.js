import React from 'react'

import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
import Cell from 'components/DataTable/Cell'
import Loading from 'components/Loading'

const getDisplaySource = source => {
  return source === 'RIDETO' ? 'RideTo' : 'Direct'
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
              <Header>Latest Activity</Header>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <Cell>
                  {customer.first_name} {customer.last_name}
                </Cell>
                <Cell>{customer.phone}</Cell>
                <Cell>{getDisplaySource(customer.source)}</Cell>
                <Cell>{customer.updated_at}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </Loading>
    )
  }
}

export default CustomerList
