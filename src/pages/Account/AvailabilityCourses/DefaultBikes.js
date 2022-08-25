import { ConnectSingleSelect } from 'components/ConnectForm'
import React, { Fragment, useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import { getCourseTypes } from 'services/course'
import DefaultBikesModal from './DefaultBikesModal'
import RowItem from './RowItem'
import styles from './styles.scss'

function DefaultBikes({ schools, info }) {
  const [activeCourse, setActiveCourse] = useState(null)
  const [courseList, setCourseList] = useState([])
  const [schoolId, setSchoolId] = useState(null)

  useEffect(() => {
    if (schools.length) {
      setSchoolId(schools[0].id)
    }
  }, [])

  useEffect(() => {
    if (schoolId) {
      getCourseTypes(schoolId).then(courseTypes => {
        setCourseList(courseTypes)
      })
    }
    // const courses = info.courseTypes.filter(courseType =>
    //   courseType.schoolIds.includes(schoolId)
    // )
    // setCourseList(courses)
  }, [schoolId, info.courseTypes])

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
              {courseList &&
                courseList.map(courseType => (
                  <RowItem
                    key={courseType.id}
                    schoolId={schoolId}
                    courseType={courseType}
                    setActiveCourse={setActiveCourse}
                  />
                ))}
            </tbody>
          </Table>
        </div>
      </div>
      {activeCourse && (
        <DefaultBikesModal
          isOpen={!!activeCourse}
          onRequestClose={() => setActiveCourse(null)}
          setActiveCourse={setActiveCourse}
          schoolId={schoolId}
          courseType={activeCourse}
        />
      )}
    </Fragment>
  )
}

export default DefaultBikes
