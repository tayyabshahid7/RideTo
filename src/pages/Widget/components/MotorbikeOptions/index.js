import React from 'react'

import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange }) => {
  console.log(course)

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire (Included)</h4>

      <div>
        <label>
          <input
            type="radio"
            checked={selected === 'auto'}
            onChange={() => onChange('auto')}
          />
          Automatic Scooter
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={selected === 'manual'}
            onChange={() => onChange('manual')}
          />
          Manual Motorcycle
        </label>
      </div>
    </div>
  )
}

export default MotorbikeOptions
