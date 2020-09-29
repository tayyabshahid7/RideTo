import React, { useEffect, useState, Fragment } from 'react'
import styles from './styles.scss'
import { Table } from 'reactstrap'
import DefaultBikesModal from './DefaultBikesModal'
import RowItem from './RowItem'
import { FULL_LICENCE_MODULES } from 'common/constants'
import { ConnectSingleSelect } from 'components/ConnectForm'

function DefaultBikes({ schools, info, loadCourseTypes, user }) {
  const [activeCourse, setActiveCourse] = useState(null)
  const [schoolId, setSchoolId] = useState(null)

  useEffect(() => {
    loadCourseTypes({ schoolId: schoolId })
  }, [schoolId])

  const handleChangeSchool = id => {
    setSchoolId(parseInt(id))
  }

  return (
    <Fragment>
      <div className={styles.defaultBikes}>
        <div className={styles.title}>Default Bikes</div>
        <div className="pb-4">
          <p>Set the default bikes available for each course</p>
          <ConnectSingleSelect
            basic
            name="school"
            value={schoolId}
            label="Create default course for"
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
                <th className="align-middle">Course</th>
                <th className="align-middle">Bikes Available</th>
              </tr>
            </thead>
            <tbody>
              {info.courseTypes
                .filter(
                  ({ constant }) =>
                    constant !== 'FULL_LICENCE' &&
                    !FULL_LICENCE_MODULES.includes(constant)
                )
                .map(courseType => {
                  return (
                    <RowItem
                      key={courseType.id}
                      schoolId={schoolId}
                      courseType={courseType}
                      activeCourse={activeCourse}
                      setActiveCourse={setActiveCourse}
                    />
                  )
                })}
            </tbody>
          </Table>
        </div>
      </div>
      <DefaultBikesModal
        isOpen={!!activeCourse}
        onRequestClose={() => {
          setActiveCourse(null)
        }}
        schoolId={schoolId}
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
      />
    </Fragment>
  )
}

export default DefaultBikes
