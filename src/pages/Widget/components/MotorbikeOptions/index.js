import React from 'react'

import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange }) => {
  const fullText = <span className={styles.full}> - Fully Booked</span>
  const isAutoFull = course.auto_count === course.auto_bikes
  const isManualFull = course.manual_count === course.manual_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire (Included)</h4>

      <div>
        <input
          type="checkbox"
          checked={selected === 'auto'}
          onChange={() => onChange(selected === 'auto' ? null : 'auto')}
          disabled={isAutoFull}
          id="autoCheck"
        />
        <label htmlFor="autoCheck">
          Automatic Scooter
          {isAutoFull ? fullText : null}
        </label>
      </div>

      <div>
        <input
          type="checkbox"
          checked={selected === 'manual'}
          onChange={() => onChange(selected === 'manual' ? null : 'manual')}
          disabled={isManualFull}
          id="manualCheck"
        />
        <label htmlFor="manualCheck">
          Manual Motorcycle
          {isManualFull ? fullText : null}
        </label>
      </div>
    </div>
  )
}

export default MotorbikeOptions
