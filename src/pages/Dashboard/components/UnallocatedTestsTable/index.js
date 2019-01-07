import React, { Component } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'

class UnallocatedTestsTable extends Component {
  render() {
    return (
      <div className={styles.container}>
        <table className="table table-responsive-md">
          <thead>
            <tr>
              <th />
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tests.map(({ id, date }, index) => {
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
}

export default UnallocatedTestsTable
