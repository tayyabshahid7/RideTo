import React, { useEffect, useState } from 'react'
import { Button } from 'components/ConnectForm'
import { getDefaultBikeHire } from 'services/course'

const DEFAULT_SETTINGS = {
  available_auto_50cc_bikes: true,
  default_number_auto_50cc_bikes: 0,
  available_auto_125cc_bikes: true,
  default_number_auto_125cc_bikes: 0,
  available_manual_50cc_bikes: true,
  default_number_manual_50cc_bikes: 0,
  available_manual_125cc_bikes: true,
  default_number_manual_125cc_bikes: 0,
  available_own_bike: true,
  default_number_own_bike: 0,
  available_a1_auto_bike: true,
  a1_auto_bikes: 0,
  available_a1_manual_bike: true,
  a1_manual_bikes: 0,
  available_a2_auto_bikes: true,
  a2_auto_bikes: 0,
  available_a2_manual_bikes: true,
  a2_manual_bikes: 0,
  available_a_auto_bike: true,
  a_auto_bikes: 0,
  available_a_manual_bikes: true,
  a_manual_bikes: 0
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
      <td className="align-middle">asdf</td>
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
