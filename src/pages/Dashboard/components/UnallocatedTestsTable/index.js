import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'

function UnallocatedTestsTable({ tests }) {
  return (
    <div className={styles.container}>
      <table className="table table-responsive-md">
        <thead>
          <tr>
            <th />
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(({ id, date, type }, index) => {
            const isExpiring = moment(date).isBefore(moment().add(13, 'days'))

            return (
              <tr
                className={classnames(
                  index % 2 ? styles.trEven : styles.trOdd,
                  isExpiring ? styles.isExpiring : null
                )}
                key={id}>
                <td>
                  <a
                    className={styles.viewLink}
                    href={`#view-test-${id}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    View
                  </a>
                </td>
                <td>{type}</td>
                <td>{date}</td>
                <td>
                  {isExpiring ? <span>Expiring</span> : <span>Fine</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default UnallocatedTestsTable
