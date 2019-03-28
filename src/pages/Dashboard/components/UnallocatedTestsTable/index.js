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
            <th>Course</th>
            <th>Centre</th>
            <th>Test Date</th>
            <th>Status</th>
            <th>Cancel Date</th>
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
                    index % 2 ? styles.trEven : styles.trOdd
                  )}
                  key={id}>
                  <td>
                    {course_type
                      .replace('Test', '')
                      .replace('Full Licence Mod', 'Module')
                      .replace('uleule', 'ule')}
                  </td>
                  <td>{test_centre_name}</td>
                  <td>{testDate.format('Do MMM')}</td>
                  <td>{TEST_STATUS_CHOICES[status]}</td>
                  <td className={classnames(isExpiring && styles.isExpiring)}>
                    {lastDateCancel.format('DD/MM')}
                  </td>
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
