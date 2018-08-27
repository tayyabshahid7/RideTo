import React from 'react'

import styles from './CustomerList.scss'
import commonStyles from 'pages/styles.scss'
import Header from 'components/DataTable/Header'
import Loading from 'components/Loading'

const getDisplaySource = source => {
  return source === 'RIDETO' ? 'RideTo' : 'Direct'
}

class CustomerList extends React.Component {
  constructor(props) {
    super(props)

    this.handleSort = this.handleSort.bind(this)
  }

  handleSort(column) {
    const { ordering = '', onSort } = this.props

    if (ordering === column) {
      return onSort(`-${column}`)
    } else {
      return onSort(column)
    }
  }

  render() {
    const { customers, isLoading } = this.props

    return (
      <Loading loading={isLoading}>
        <table className={commonStyles.dataTable}>
          <thead>
            <tr>
              <Header name="last_name" onSort={this.handleSort}>
                Name
              </Header>
              <Header name="phone" onSort={this.handleSort}>
                Phone
              </Header>
              <Header name="source" onSort={this.handleSort}>
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
