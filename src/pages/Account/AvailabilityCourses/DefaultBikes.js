import React, { useEffect, useState, Fragment } from 'react'
import styles from './styles.scss'
import { Table } from 'reactstrap'
import DefaultBikesModal from './DefaultBikesModal'
import RowItem from './RowItem'

function DefaultBikes({ info, loadCourseTypes, schoolId }) {
  const [activeCourse, setActiveCourse] = useState(null)

  useEffect(() => {
    if (!info.courseTypes.length) {
      loadCourseTypes({ schoolId: schoolId })
    }
  }, [info.courseTypes])

  return (
    <Fragment>
      <div className={styles.defaultBikes}>
        <div className={styles.title}>Default Bikes</div>
        <p>
          Set the default bike hire types and numer available for each course
          type
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
              {info.courseTypes
                .filter(({ constant }) => constant !== 'FULL_LICENCE')
                .map(courseType => {
                  return (
                    <RowItem
                      key={courseType.id}
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
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
      />
    </Fragment>
  )
}

export default DefaultBikes
