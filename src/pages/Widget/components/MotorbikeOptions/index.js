import React from 'react'

import { getMotorbikeLabel } from 'services/widget'
import Checkbox from 'components/Checkbox'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange, ownBike = false }) => {
  const fullText = <span className={styles.full}> - Fully Booked</span>
  const isAutoFull = course.auto_count >= course.auto_bikes
  const isManualFull = course.manual_count >= course.manual_bikes
  const isOwnFull = course.own_bikes_count >= course.own_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire (Included)</h4>

      {ownBike && (
        <Checkbox
          checked={selected === 'no'}
          extraClass="WidgetCheckbox"
          onChange={() => onChange('no')}
          disabled={isOwnFull}>
          {getMotorbikeLabel('no')}
          {isOwnFull ? fullText : null}
        </Checkbox>
      )}

      <Checkbox
        checked={selected === 'auto'}
        extraClass="WidgetCheckbox"
        onChange={() => onChange('auto')}
        disabled={isAutoFull}>
        {getMotorbikeLabel('auto')}
        {isAutoFull ? fullText : null}
      </Checkbox>

      <Checkbox
        checked={selected === 'manual'}
        extraClass="WidgetCheckbox"
        onChange={() => onChange('manual')}
        disabled={isManualFull}>
        {getMotorbikeLabel('manual')}
        {isManualFull ? fullText : null}
      </Checkbox>
    </div>
  )
}

export default MotorbikeOptions
