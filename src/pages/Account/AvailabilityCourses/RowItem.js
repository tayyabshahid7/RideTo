import React, { useEffect, useState } from 'react'
import { Button } from 'components/ConnectForm'
import { getDefaultBikeHire } from 'services/course'
import { formatName, filterBikes } from './DefaultBikesModal'
import startCase from 'lodash/startCase'
import { DEFAULT_SETTINGS } from 'common/constants'

function formatListItem(key) {
  return startCase(
    formatName(key)
      .replace('bikes', '')
      .trim()
  )
}

function RowItem({ setActiveCourse, courseType }) {
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
  }, [])

  return (
    <tr>
      <td className="align-middle">{name}</td>
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
      <td className="align-middle text-center">
        <Button
          disabled={loading}
          small
          onClick={() => {
            setActiveCourse({ ...courseType, settings })
          }}>
          Edit
        </Button>
      </td>
    </tr>
  )
}

export default RowItem
