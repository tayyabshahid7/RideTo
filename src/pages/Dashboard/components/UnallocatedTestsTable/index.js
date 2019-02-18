import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import { TEST_STATUS_CHOICES } from 'common/constants'

function UnallocatedTestsTable({ tests }) {
  return (
    <div className={styles.container}>
      <table className="table table-responsive-md">
        <thead>
          <tr>
            <th>Test</th>
            <th>Centre</th>
            <th>Date</th>
            <th>Last date to cancel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(
            (
              {
                id,
                date,
                last_date_cancel,
                test_centre_name,
                course_type,
                status
              },
              index
            ) => {
              const testDate = moment(date)
              const lastDateCancel = moment(last_date_cancel)
              const isExpiring = lastDateCancel.isBefore(
                moment().add(3, 'days')
              )
              return (
                <tr
                  className={classnames(
                    index % 2 ? styles.trEven : styles.trOdd,
                    isExpiring ? styles.isExpiring : null
                  )}
                  key={id}>
                  <td>{course_type.replace('Test', '')}</td>
                  <td>{test_centre_name}</td>
                  <td>{testDate.format('ddd, Do MMM YYYY')}</td>
                  <td>{lastDateCancel.format('ddd, Do MMM YYYY')}</td>
                  <td>{TEST_STATUS_CHOICES[status]}</td>
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UnallocatedTestsTable
