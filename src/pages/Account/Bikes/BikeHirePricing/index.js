import { ConnectSingleSelect } from 'components/ConnectForm'
import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { getBikeHirePricing } from 'services/settings'
import styles from './styles.scss'

export function BikeHirePricing({ schools }) {
  const [schoolId, setSchoolId] = useState(null)
  const bikeHireTypes = ['Auto', 'Manual']

  useEffect(() => {
    if (schools.length) {
      setSchoolId(schools[0].id)
      getBikeHirePricing(schools[0].id)
    }
  }, [])

  const numberFormat = value =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value)

  const handleChangeSchool = id => {
    setSchoolId(parseInt(id))
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>Bike Hire Pricing</div>
        <div className="pb-4">
          <p>Set pricing for auto/manual bikes</p>
          <ConnectSingleSelect
            basic
            name="school"
            value={schoolId}
            label="Set default bike hire pricing for"
            className="form-group"
            type="text"
            onChange={handleChangeSchool}
            required
            options={schools}
          />
        </div>
        <div className={styles.tableWrapper}>
          <Table bordered responsive size="sm">
            <thead className="thead-light">
              <tr>
                <th className="align-middle">Bike Hire Type</th>
                <th className="align-middle">Price</th>
              </tr>
            </thead>
            <tbody>
              {bikeHireTypes &&
                bikeHireTypes.map(bikeHire => (
                  <tr key={bikeHire}>
                    <td className="align-middle">{bikeHire}</td>
                    <td className="align-middle">
                      {/* <div
                      className={styles.courseName}
                      onClick={() => setActiveCourse(courseType)}>
                      {courseType.name}
                    </div> */}
                      {numberFormat(10)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  )
}
