import React from 'react'

import styles from './CustomerList.scss'
import commonStyles from 'pages/styles.scss'

const getDisplaySource = source => {
  return source === 'RIDETO' ? 'RideTo' : 'Direct'
}

class CustomerList extends React.Component {
  render() {
    const { customers } = this.props

    return (
      <table className={commonStyles.dataTable}>
        <thead>
          <th>Name</th>
          <th>Phone</th>
          <th>Source</th>
          <th>Latest Activity</th>
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
    )
  }
}

export default CustomerList
