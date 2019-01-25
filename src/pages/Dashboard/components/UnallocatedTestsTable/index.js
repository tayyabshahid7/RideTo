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
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(({ id, date, course_type }, index) => {
            const isExpiring = moment(date).isBefore(moment().add(13, 'days'))

            return (
              <tr
                className={classnames(
                  index % 2 ? styles.trEven : styles.trOdd,
                  isExpiring ? styles.isExpiring : null
                )}
                key={id}>
                <td>{course_type}</td>
                <td>{date}</td>
                <td>
                  {isExpiring ? <span>Expiring Soon</span> : <span>Ok</span>}
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
