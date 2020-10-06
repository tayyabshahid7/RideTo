import React from 'react'
import { formatName, filterBikes } from './DefaultBikesModal'
import { DEFAULT_SETTINGS } from 'common/constants'
import styles from './styles.scss'

function formatListItem(key) {
  return formatName(key)
    .replace('bikes', '')
    .trim()
}

function RowItem({ setActiveCourse, courseType, schoolId }) {
  let currBikeHire = courseType.bike_hire_setup.find(
    x => x.supplier.id === parseInt(schoolId)
  )

  if (!currBikeHire) {
    currBikeHire = DEFAULT_SETTINGS
  }

  const text = Object.entries(currBikeHire)
    .filter(([key, value]) => key.startsWith('available_') && value === true)
    .filter(bike => filterBikes(courseType, bike))
    .map(([key, value]) => formatListItem(key))
    .join(', ')

  return (
    <tr>
      <td className="align-middle">
        <div
          className={styles.courseName}
          onClick={() => setActiveCourse(courseType)}>
          {courseType.name}
        </div>
      </td>
      <td className="align-middle">{text}</td>
    </tr>
  )
}

export default RowItem
