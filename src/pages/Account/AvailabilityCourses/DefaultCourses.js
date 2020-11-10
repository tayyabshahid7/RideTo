import React, { useEffect, useState, Fragment } from 'react'
import styles from './styles.scss'
import { ConnectSingleSelect, ConnectCheckbox } from 'components/ConnectForm'

function DefaultCourses({ schools, info }) {
  const [courseList, setCourseList] = useState([])
  const [schoolId, setSchoolId] = useState(null)

  useEffect(() => {
    if (schools.length) {
      setSchoolId(schools[0].id)
      updateCourseList()
    }
  }, [])

  useEffect(() => {
    updateCourseList()
  }, [schoolId, info.courseTypes])

  const updateCourseList = () => {
    const courses = info.courseTypes.filter(courseType =>
      courseType.schoolIds.includes(schoolId)
    )
    setCourseList(courses)
  }

  const handleChangeSchool = id => {
    setSchoolId(parseInt(id))
  }

  const handleChecked = ({ target }) => {
    // const { name, checked } = target
  }

  return (
    <Fragment>
      <div className={styles.defaultBikes}>
        <div className={styles.title}>Available Courses</div>
        <p>
          Courses which are available for customers to book online through the
          widget
        </p>
        <div className="pb-4">
          <ConnectSingleSelect
            basic
            name="school"
            value={schoolId}
            label=""
            className="form-group"
            type="text"
            onChange={handleChangeSchool}
            required
            options={schools}
          />
        </div>

        <div className={styles.tableWrapper}>
          {courseList.map(courseType => (
            <ConnectCheckbox
              key={courseType.id}
              label={courseType.name}
              name={courseType.name}
              disabled={courseType.constant.startsWith('FULL_LICENCE')}
              fainted={courseType.constant.startsWith('FULL_LICENCE')}
              checked={!courseType.constant.startsWith('FULL_LICENCE')}
              type="checkbox"
              onChange={handleChecked}
            />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default DefaultCourses
