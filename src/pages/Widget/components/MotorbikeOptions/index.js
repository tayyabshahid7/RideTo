import React from 'react'
import { BIKE_HIRE } from 'common/constants'
import { getMotorbikeLabel, asPoundSterling } from 'services/widget'
import Checkbox from 'components/Checkbox'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({ selected, course, onChange, ownBike = false }) => {
  let { bike_hire_cost } = course.pricing

  const isFree = !bike_hire_cost

  const fullText = <span className={styles.full}> - Fully Booked</span>

  const isAutoFull = course.auto_count >= course.auto_bikes
  const isManualFull = course.manual_count >= course.manual_bikes

  const isAuto125Full = course.auto_125cc_count >= course.auto_125cc_bikes
  const isManual50Full = course.manual_50cc_count >= course.manual_50cc_bikes

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire {isFree && '(Included)'}</h4>

      {ownBike && (
        <Checkbox
          checked={selected === BIKE_HIRE.NO}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.NO)}>
          {getMotorbikeLabel(BIKE_HIRE.NO)}
        </Checkbox>
      )}

      <Checkbox
        checked={selected === BIKE_HIRE.AUTO}
        extraClass="WidgetCheckbox"
        onChange={() => onChange(BIKE_HIRE.AUTO)}
        disabled={isAutoFull}>
        {getMotorbikeLabel(BIKE_HIRE.AUTO)}
        {isAutoFull ? fullText : null}
        {bike_hire_cost > 0 && (
          <div className={styles.price}>{`(+${asPoundSterling(
            bike_hire_cost
          )})`}</div>
        )}
        {bike_hire_cost === 0 && <div className={styles.price}>Free</div>}
      </Checkbox>

      <Checkbox
        checked={selected === BIKE_HIRE.MANUAL}
        extraClass="WidgetCheckbox"
        onChange={() => onChange(BIKE_HIRE.MANUAL)}
        disabled={isManualFull}>
        {getMotorbikeLabel(BIKE_HIRE.MANUAL)}
        {isManualFull ? fullText : null}
        {bike_hire_cost > 0 && (
          <div className={styles.price}>
            {`(+${asPoundSterling(bike_hire_cost)})`}
          </div>
        )}
      </Checkbox>

      {course.auto_125cc_bikes > 0 && (
        <Checkbox
          checked={selected === BIKE_HIRE.AUTO_125CC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.AUTO_125CC)}
          disabled={isAuto125Full}>
          {getMotorbikeLabel(BIKE_HIRE.AUTO_125CC)}
          {isAutoFull ? fullText : null}
          {bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
          {bike_hire_cost === 0 && <div className={styles.price}>Free</div>}
        </Checkbox>
      )}

      {course.manual_50cc_bikes > 0 && (
        <Checkbox
          checked={selected === BIKE_HIRE.MANUAL_50CC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.MANUAL_50CC)}
          disabled={isManual50Full}>
          {getMotorbikeLabel(BIKE_HIRE.MANUAL_50CC)}
          {isManualFull ? fullText : null}
          {bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}
    </div>
  )
}

export default MotorbikeOptions
