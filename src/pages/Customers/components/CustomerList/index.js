import React from 'react'

import styles from './CustomerList.scss'
import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
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
              <th>Latest Activity</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>
                  {customer.first_name} {customer.last_name}
                </td>
                <td>{customer.phone}</td>
                <td>{getDisplaySource(customer.source)}</td>
                <td>{customer.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Loading>
    )
  }
}

export default CustomerList
