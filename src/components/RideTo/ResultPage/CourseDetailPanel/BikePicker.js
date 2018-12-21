import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getMotorbikeLabel } from 'services/widget'

function BikePicker({
  isCbt,
  isCbtRenewal,
  bike_hire,
  onUpdate,
  course,
  isAutoFull,
  isManualFull,
  has_auto_bikes,
  has_manual_bikes,
  isFullLicence
}) {
  const fullText = <span className={styles.full}> - Fully Booked</span>
  const manualText = (
    <span className={styles.manualInfo}>
      Please note: If you haven't ridden a manual (geared) bike before and
      expect to complete the CBT training in one day, you may find you need
      additional training to complete your CBT. If your not sure, call us on
      02036039652 to talk to a member of our friendly team.
    </span>
  )

  return (
    <div className={styles.bikeHireWrapper}>
      <label id="choose-bike" className={styles.subtitle1}>
        {!isFullLicence ? 'Choose A Bike to Hire' : 'Type of Bike'}
      </label>

      {isCbtRenewal && (
        <button
          className={classnames(
            styles.bikeHireBtn,
            bike_hire === 'no' && styles.activeBtn
          )}
          onClick={() => onUpdate({ bike_hire: 'no' })}>
          {getMotorbikeLabel('no')}
        </button>
      )}
      {bike_hire === 'no' && (
        <div className={styles.ownBikeDisclaimer}>
          You must bring a valid CBT Certificate, Insurance Documents, Tax and
          MOT if you wish to train on your own bike.
        </div>
      )}
      <div className={isFullLicence && styles.bikeButtons}>
        {has_auto_bikes && (
          <button
            className={classnames(
              styles.bikeHireBtn,
              bike_hire === 'auto' && styles.activeBtn
            )}
            onClick={() => onUpdate({ bike_hire: 'auto' })}
            disabled={isAutoFull}>
            {getMotorbikeLabel('auto')}{' '}
            {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
            {isAutoFull ? fullText : null}
          </button>
        )}
        {has_manual_bikes && (
          <button
            className={classnames(
              styles.bikeHireBtn,
              bike_hire === 'manual' && styles.activeBtn
            )}
            onClick={() => onUpdate({ bike_hire: 'manual' })}
            disabled={isManualFull}>
            {getMotorbikeLabel('manual')}{' '}
            {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
            {isManualFull ? fullText : null}
          </button>
        )}
      </div>
      {isCbt && bike_hire === 'manual' && manualText}
    </div>
  )
}

export default BikePicker
