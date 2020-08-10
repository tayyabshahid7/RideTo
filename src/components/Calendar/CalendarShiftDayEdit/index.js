import React, { useEffect, useRef, useState } from 'react'
import {
  IconClock,
  IconHoliday,
  IconBlocker,
  IconSick
} from '../../../assets/icons'

import styles from './index.scss'

const CalendarShiftDayEdit = ({ onClick }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const inputEl = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (inputEl && !inputEl.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAdd = type => () => {
    setShowDropdown(false)
    onClick && onClick(type)
  }

  return (
    <div className={styles.container} ref={inputEl}>
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className={styles.editButton}>
        Edit
      </div>
      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem} onClick={handleAdd('SHIFT')}>
            <IconClock /> <span>Add Shift</span>
          </div>
          <div className={styles.dropdownItem} onClick={handleAdd('BLOCKER')}>
            <IconBlocker /> <span>Add Blocker</span>
          </div>
          <div className={styles.dropdownItem} onClick={handleAdd('SICK_DAY')}>
            <IconSick /> <span>Add Sick Day</span>
          </div>
          <div className={styles.dropdownItem} onClick={handleAdd('HOLIDAY')}>
            <IconHoliday /> <span>Add Holiday</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarShiftDayEdit
