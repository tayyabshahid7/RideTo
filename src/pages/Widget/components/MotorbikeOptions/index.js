import React from 'react'

import { getMotorbikeLabel } from 'services/widget'
import Checkbox from 'components/Checkbox'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange }) => {
  const fullText = <span className={styles.full}> - Fully Booked</span>
  const isAutoFull = course.auto_count === course.auto_bikes
  const isManualFull = course.manual_count === course.manual_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire (Included)</h4>

      <Checkbox checked={selected === 'no'} onChange={() => onChange('no')}>
        {getMotorbikeLabel('no')}
      </Checkbox>

      <Checkbox
        checked={selected === 'auto'}
        onChange={() => onChange(selected === 'auto' ? 'no' : 'auto')}
        disabled={isAutoFull}>
        {getMotorbikeLabel('auto')}
        {isAutoFull ? fullText : null}
      </Checkbox>

      <Checkbox
        checked={selected === 'manual'}
        onChange={() => onChange(selected === 'manual' ? 'no' : 'manual')}
        disabled={isManualFull}>
        {getMotorbikeLabel('manual')}
        {isManualFull ? fullText : null}
      </Checkbox>
    </div>
  )
}

export default MotorbikeOptions
