import { BIKE_HIRE } from 'common/constants'
import Checkbox from 'components/WidgetCheckbox'
import React from 'react'
import { asPoundSterling, getMotorbikeLabel } from 'services/widget'
import styles from './MotorbikeOptions.scss'

const MotorbikeOptions = ({
  selected,
  bikeSetup,
  course,
  onChange,
  ownBike = false
}) => {
  let {
    bike_hire_cost,
    bike_type_manual_price,
    bike_type_auto_50_price,
    bike_type_auto_125_price,
    bike_type_auto_electric_price,
    bike_type_auto_price,
    bike_type_manual_50_price
  } = course.pricing

  const isRenewal = course.course_type.constant === 'LICENCE_CBT_RENEWAL'

  const isFree =
    !bike_hire_cost &&
    !bike_type_manual_price &&
    !bike_type_auto_50_price &&
    !bike_type_auto_125_price &&
    !bike_type_auto_price &&
    !bike_type_manual_50_price

  const fullText = <span className={styles.full}> - Fully Booked</span>

  // determining course state for auto 50cc bikes
  const isAutoFull = course.auto_count >= course.auto_bikes

  // determining course state for auto 50cc bikes
  const isAuto50Full = course.auto_50cc_count >= course.auto_50cc_bikes

  // determining course state for auto 50cc bikes
  const isAutoElectricFull =
    course.auto_electric_count >= course.auto_electric_bikes

  // determining course state for auto 125cc bikes
  const isAuto125Full = course.auto_125cc_count >= course.auto_125cc_bikes

  // determining course state for manual 50cc bikes
  const isManual50Full = course.manual_50cc_count >= course.manual_50cc_bikes

  // determining course state for manual 125cc bikes
  const isManualFull = course.manual_count >= course.manual_bikes

  // determining course state for own bikes
  const isOwnFull = course.own_bikes_count >= course.own_bikes

  const isAvailable = type => {
    return course[type] > 0 || (bikeSetup && bikeSetup[`available_${type}`])
  }

  return (
    <div className={styles.motorbikeOptions}>
      <h4>Bike Hire {isFree && '(Included)'}</h4>

      {/* {ownBike && (
        <Checkbox
          checked={selected === BIKE_HIRE.NO}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.NO)}>
          {getMotorbikeLabel(BIKE_HIRE.NO)}
        </Checkbox>
      )} */}

      {/* Auto Bikes   */}

      {isAvailable('auto_bikes') && (
        <Checkbox
          checked={selected === BIKE_HIRE.AUTO}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.AUTO)}
          disabled={isAutoFull}>
          {getMotorbikeLabel(BIKE_HIRE.AUTO)}
          {isAutoFull ? fullText : null}
          {!isRenewal && bike_type_auto_price > 0 && (
            <div className={styles.price}>{`(+${asPoundSterling(
              bike_type_auto_price
            )})`}</div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Auto Bikes 50cc  */}

      {isAvailable('auto_50cc_bikes') && (
        <Checkbox
          checked={selected === BIKE_HIRE.AUTO_50CC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.AUTO_50CC)}
          disabled={isAuto50Full}>
          {getMotorbikeLabel(BIKE_HIRE.AUTO_50CC)}
          {isAuto50Full ? fullText : null}
          {!isRenewal && bike_type_auto_50_price > 0 && (
            <div className={styles.price}>{`(+${asPoundSterling(
              bike_type_auto_50_price
            )})`}</div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Auto Bikes 125cc  */}

      {isAvailable('auto_125cc_bikes') && (
        <Checkbox
          checked={selected === BIKE_HIRE.AUTO_125CC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.AUTO_125CC)}
          disabled={isAuto125Full}>
          {getMotorbikeLabel(BIKE_HIRE.AUTO_125CC)}
          {isAuto125Full ? fullText : null}
          {!isRenewal && bike_type_auto_125_price > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_type_auto_125_price)})`}
            </div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Auto Bikes Electric  */}

      {isAvailable('auto_electric_bikes') && (
        <Checkbox
          checked={selected === BIKE_HIRE.AUTO_ELECTRIC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.AUTO_ELECTRIC)}
          disabled={isAutoElectricFull}>
          {getMotorbikeLabel(BIKE_HIRE.AUTO_ELECTRIC)}
          {isAutoElectricFull ? fullText : null}
          {!isRenewal && bike_type_auto_electric_price > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_type_auto_electric_price)})`}
            </div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Manual Bikes 50cc  */}

      {isAvailable('manual_50cc_bikes') && (
        <Checkbox
          checked={selected === BIKE_HIRE.MANUAL_50CC}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.MANUAL_50CC)}
          disabled={isManual50Full}>
          {getMotorbikeLabel(BIKE_HIRE.MANUAL_50CC)}
          {isManual50Full ? fullText : null}
          {!isRenewal && bike_type_manual_50_price > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_type_manual_50_price)})`}
            </div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Manual Bikes 125cc  */}

      {(isAvailable('manual_bikes') || isAvailable('manual_125cc_bikes')) && (
        <Checkbox
          checked={selected === BIKE_HIRE.MANUAL}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.MANUAL)}
          disabled={isManualFull}>
          {getMotorbikeLabel(BIKE_HIRE.MANUAL)}
          {isManualFull ? fullText : null}
          {!isRenewal && bike_type_manual_price > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_type_manual_price)})`}
            </div>
          )}
          {isRenewal && bike_hire_cost > 0 && (
            <div className={styles.price}>
              {`(+${asPoundSterling(bike_hire_cost)})`}
            </div>
          )}
        </Checkbox>
      )}

      {/* Own Bikes  */}
      {ownBike && (
        <Checkbox
          checked={selected === BIKE_HIRE.NO}
          extraClass="WidgetCheckbox"
          onChange={() => onChange(BIKE_HIRE.NO)}
          disabled={isOwnFull}>
          {getMotorbikeLabel(BIKE_HIRE.NO)}
          {isOwnFull ? fullText : null}
        </Checkbox>
      )}
    </div>
  )
}

export default MotorbikeOptions
