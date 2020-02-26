import React, { useEffect, useState } from 'react'
import { getDefaultBikeHire } from 'services/course'
import { formatName, filterBikes } from './DefaultBikesModal'
import { DEFAULT_SETTINGS } from 'common/constants'
import styles from './styles.scss'

function formatListItem(key) {
  return formatName(key)
    .replace('bikes', '')
    .trim()
}

function RowItem({ activeCourse, setActiveCourse, courseType }) {
  const { name, constant } = courseType
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await getDefaultBikeHire(constant)

        setSettings(response)
      } catch {
        setSettings(DEFAULT_SETTINGS)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [activeCourse])

  return (
    <tr>
      <td className="align-middle">
        <div
          disabled={loading}
          className={styles.courseName}
          onClick={() => {
            setActiveCourse({ ...courseType, settings })
          }}>
          {name}
        </div>
      </td>
      <td className="align-middle">
        {settings &&
          Object.entries(settings)
            .filter(
              ([key, value]) => key.startsWith('available_') && value === true
            )
            .filter(bike => filterBikes(courseType, bike))
            .map(([key, value]) => formatListItem(key))
            .join(', ')}
      </td>
    </tr>
  )
}

export default RowItem
