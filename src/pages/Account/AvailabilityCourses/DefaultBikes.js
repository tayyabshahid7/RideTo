import React from 'react'
import styles from './styles.scss'
import { Button } from 'components/ConnectForm'
import { Table } from 'reactstrap'

function DefaultBikes() {
  return (
    <div className={styles.defaultBikes}>
      <div className={styles.title}>Default Bikes</div>
      <p>
        Set the default bike hire types and numer available for each course type
      </p>
      <div className={styles.tableWrapper}>
        <Table bordered responsive size="sm">
          <thead className="thead-light">
            <tr>
              <th className="align-middle">Course</th>
              <th className="align-middle">Bikes available</th>
              <th className="align-middle"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="align-middle">CBT Training</td>
              <td className="align-middle">asdf</td>
              <td className="align-middle text-right">
                <Button small>Edit</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default DefaultBikes
