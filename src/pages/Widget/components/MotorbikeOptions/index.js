import React from 'react'

import { getMotorbikeLabel } from 'services/widget'
import Checkbox from 'components/Checkbox'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange, ownBike = false }) => {
  const fullText = <span className={styles.full}> - Fully Booked</span>

  const isAutoFull = course.auto_count >= course.auto_bikes
  const isManualFull = course.manual_count >= course.manual_bikes

  const isAuto125Full = course.auto_125cc_count >= course.auto_125cc_bikes
  const isManual50Full = course.manual_50cc_count >= course.manual_50cc_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire (Included)</h4>

      {ownBike && (
        <Checkbox
          checked={selected === 'no'}
          extraClass="WidgetCheckbox"
          onChange={() => onChange('no')}>
          {getMotorbikeLabel('no')}
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

      {course.auto_125cc_bikes && (
        <Checkbox
          checked={selected === 'AUTO_125CC'}
          extraClass="WidgetCheckbox"
          onChange={() => onChange('AUTO_125CC')}
          disabled={isAuto125Full}>
          {getMotorbikeLabel('AUTO_125CC')}
          {isAutoFull ? fullText : null}
        </Checkbox>
      )}

      {course.manual_50cc_bikes && (
        <Checkbox
          checked={selected === 'MANUAL_50CC'}
          extraClass="WidgetCheckbox"
          onChange={() => onChange('MANUAL_50CC')}
          disabled={isManual50Full}>
          {getMotorbikeLabel('MANUAL_50CC')}
          {isManualFull ? fullText : null}
        </Checkbox>
      )}
    </div>
  )
}

export default MotorbikeOptions
