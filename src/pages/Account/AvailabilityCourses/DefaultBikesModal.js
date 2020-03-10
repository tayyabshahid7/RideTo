import React, { useState } from 'react'
import styles from './BikesModal.scss'
import Modal from 'react-modal'
import { Table } from 'reactstrap'
import BikeNumberPicker from 'components/BikeNumberPicker'
import { Button } from 'components/ConnectForm'
import upperFirst from 'lodash/upperFirst'
import { updateDefaultBikeHire } from 'services/course'

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root')
}

const customStyles = {
  overlay: {
    zIndex: 10000,
    backgroundColor: 'rgba(0,0,0,0.62)'
  },
  content: {
    width: '80%',
    maxWidth: '690px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0'
  }
}

function isFullLicence(constant) {
  return constant.startsWith('FULL_LICENCE_')
}

function isDasBike(key) {
  return [
    'available_a1_auto_bikes',
    'available_a1_manual_bikes',
    'available_a2_auto_bikes',
    'available_a2_manual_bikes',
    'available_a_auto_bikes',
    'available_a_manual_bikes'
  ].includes(key)
}

function getCountKey(key) {
  const replacement = isDasBike(key) ? '' : 'default_number_'

  return key.replace('available_', replacement)
}

export function formatName(key) {
  return upperFirst(key.replace('available_', '').replace(/_/g, ' '))
}

export const filterBikes = (activeCourse, [key]) =>
  isFullLicence(activeCourse.constant) ? isDasBike(key) : !isDasBike(key)

function DefaultBikesModal({
  activeCourse,
  setActiveCourse,
  schoolId,
  ...rest
}) {
  const [isChanged, setIsChanged] = useState(false)

  if (!activeCourse) {
    return null
  }

  const { name, settings } = activeCourse
  const courses = Object.entries(settings)
    .filter(([key, value]) => key.startsWith('available'))
    .filter(bike => filterBikes(activeCourse, bike))
    .map(([key, value]) => {
      const countKey = getCountKey(key)

      return {
        key,
        countKey,
        name: formatName(key),
        available: value,
        count: settings[countKey]
      }
    })

  const handleCheckboxClick = (event, key) => {
    const { checked } = event.target
    const countKey = getCountKey(key)

    setActiveCourse({
      ...activeCourse,
      settings: {
        ...activeCourse.settings,
        [key]: checked,
        ...(!checked && { [countKey]: 0 })
      }
    })
    setIsChanged(true)
  }

  const handleSave = async () => {
    try {
      setIsChanged(false)
      await updateDefaultBikeHire(activeCourse, schoolId)
      setActiveCourse(null)
    } catch {
      setIsChanged(true)
    }
  }

  const handleChangeCount = (countKey, value = 0) => {
    setActiveCourse({
      ...activeCourse,
      settings: {
        ...activeCourse.settings,
        [countKey]: value
      }
    })
    setIsChanged(true)
  }
  const courseOrder = {
    available_auto_bikes: 1,
    available_auto_50cc_bikes: 2,
    available_auto_125cc_bikes: 3,
    available_manual_50cc_bikes: 4,
    available_manual_125cc_bikes: 5,
    available_own_bikes: 6
  }
  courses.sort((a, b) => {
    return courseOrder[a.key] > courseOrder[b.key] ? 1 : -1
  })

  return (
    <Modal
      {...rest}
      style={customStyles}
      ariaHideApp={!process.env.NODE_ENV === 'test'}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Set Course Default Bikes</h2>
        </div>
        <div className={styles.body}>
          <div className={styles.courseName}>
            <b>Course:</b> {name}
          </div>
          <div className={styles.courseDetails}>
            <Table borderless size="sm">
              <thead className={styles.tableHead}>
                <tr>
                  <th>Bikes</th>
                  <th className="text-center">Available</th>
                  <th className="text-center">Number Available</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {courses.map(
                  ({ name, available, key, countKey, count }, index) => (
                    <tr key={index}>
                      <td>{name}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={available}
                          onChange={e => {
                            handleCheckboxClick(e, key)
                          }}
                        />
                      </td>
                      <td className="text-center">
                        {available && (
                          <BikeNumberPicker
                            value={count}
                            isEditable={available}
                            className={styles.bikePicker}
                            onClickMinus={() => {
                              handleChangeCount(countKey, count ? count - 1 : 0)
                            }}
                            onChange={e => {
                              handleChangeCount(countKey, e.target.value)
                            }}
                            onClickPlus={() => {
                              handleChangeCount(countKey, count + 1)
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            small
            type="submit"
            color="primary"
            onClick={handleSave}
            disabled={!isChanged}>
            Save
          </Button>
          <Button
            small
            color="white"
            onClick={() => {
              setActiveCourse(null)
            }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DefaultBikesModal
