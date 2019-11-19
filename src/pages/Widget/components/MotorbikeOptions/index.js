import React from 'react'

import { getMotorbikeLabel, asPoundSterling } from 'services/widget'
import Checkbox from 'components/Checkbox'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange, ownBike = false }) => {
  let { bike_hire_cost, manual_bike_hire_cost } = course.pricing

  if (!manual_bike_hire_cost) {
    manual_bike_hire_cost = bike_hire_cost
  }

  const isFree = !bike_hire_cost && !manual_bike_hire_cost
  const fullText = <span className={styles.full}> - Fully Booked</span>
  const isAutoFull = course.auto_count === course.auto_bikes
  const isManualFull = course.manual_count === course.manual_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire {isFree && '(Included)'}</h4>

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
        {bike_hire_cost > 0 && ` - ${asPoundSterling(bike_hire_cost)}`}
      </Checkbox>

      <Checkbox
        checked={selected === 'manual'}
        extraClass="WidgetCheckbox"
        onChange={() => onChange('manual')}
        disabled={isManualFull}>
        {getMotorbikeLabel('manual')}
        {isManualFull ? fullText : null}
        {manual_bike_hire_cost > 0 &&
          ` - ${asPoundSterling(manual_bike_hire_cost)}`}
      </Checkbox>
    </div>
  )
}

export default MotorbikeOptions
