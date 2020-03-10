import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { getMotorbikeLabel } from 'services/widget'
import Loading from 'components/Loading'
import { BIKE_HIRE } from 'common/constants'

const BikePicker = React.forwardRef(
  (
    {
      isCbt,
      isItm,
      isCbtRenewal,
      bike_hire,
      onUpdate,
      course,

      isAutoFull,
      isAuto50Full,
      isAuto125Full,
      isManualFull,
      isManual50Full,

      isAutoAvailable,
      isAuto50Available,
      isAuto125Available,
      isManualAvailable,
      isManual50Available,

      has_auto_bikes,
      has_auto_50cc_bikes,
      has_auto_bikes_125cc,
      has_manual_bikes,
      has_manual_50cc,

      isFullLicence,
      loading,
      isWidget,
      needsHelp,
      isInstantBook
    },
    ref
  ) => {
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
      <Loading loading={loading}>
        <div className={styles.bikeHireWrapper} ref={ref}>
          <label id="choose-bike" className={styles.subtitle1}>
            {!isFullLicence ? (
              'Choose A Bike to Hire:'
            ) : (
              <React.Fragment>
                {!needsHelp && <span className={styles.stepNumber}>2</span>}{' '}
                Bike type
              </React.Fragment>
            )}
          </label>

          {isCbtRenewal && (
            <button
              className={classnames(
                styles.bikeHireBtn,
                isWidget && styles.widgetBtn,
                bike_hire === 'no' && styles.activeBtn
              )}
              onClick={() => onUpdate({ bike_hire: 'no' })}>
              {getMotorbikeLabel('no')}
            </button>
          )}
          {isCbtRenewal && bike_hire === 'no' && (
            <div className={styles.ownBikeDisclaimer}>
              You must bring a valid CBT Certificate, Insurance Documents, Tax
              and MOT if you wish to train on your own bike.
            </div>
          )}
          <div className={isFullLicence && styles.bikeButtons}>
            {/* auto */}

            {has_auto_bikes && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  bike_hire === 'auto' && styles.activeBtn
                )}
                onClick={() =>
                  onUpdate({
                    bike_hire: 'auto',
                    selectedLicenceType: null,
                    selectedPackageDays: '',
                    selectedPackageDates: []
                  })
                }
                disabled={
                  (isFullLicence && !has_auto_bikes) ||
                  (!isFullLicence && (isAutoFull || !isAutoAvailable))
                }>
                {getMotorbikeLabel('auto', isFullLicence, isInstantBook)}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isAutoFull ? fullText : null}
              </button>
            )}
            {/* auto 50 */}

            {has_auto_50cc_bikes && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  bike_hire === 'auto_50cc' && styles.activeBtn
                )}
                onClick={() =>
                  onUpdate({
                    bike_hire: 'auto_50cc',
                    selectedLicenceType: null,
                    selectedPackageDays: '',
                    selectedPackageDates: []
                  })
                }
                disabled={
                  (isFullLicence && !has_auto_50cc_bikes) ||
                  (!isFullLicence && (isAuto50Full || !isAutoAvailable))
                }>
                {getMotorbikeLabel('auto_50cc', isFullLicence, isInstantBook)}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isAuto50Full ? fullText : null}
              </button>
            )}

            {/* auto 125 */}

            {!isFullLicence && has_auto_bikes_125cc && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  bike_hire === BIKE_HIRE.AUTO_125CC && styles.activeBtn
                )}
                onClick={() =>
                  onUpdate({
                    bike_hire: BIKE_HIRE.AUTO_125CC,
                    selectedLicenceType: null,
                    selectedPackageDays: '',
                    selectedPackageDates: []
                  })
                }
                disabled={isAuto125Full || !isAuto125Available}>
                {getMotorbikeLabel(BIKE_HIRE.AUTO_125CC, isFullLicence)}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isAuto125Full ? fullText : null}
              </button>
            )}

            {/* manual 125 */}

            {has_manual_bikes && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  bike_hire === 'manual' && styles.activeBtn
                )}
                onClick={() =>
                  onUpdate({
                    bike_hire: 'manual',
                    selectedLicenceType: null,
                    selectedPackageDays: '',
                    selectedPackageDates: []
                  })
                }
                disabled={
                  (isFullLicence && !has_manual_bikes) ||
                  (!isFullLicence && (isManualFull || !isManualAvailable))
                }>
                {getMotorbikeLabel('manual', isFullLicence)}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isManualFull ? fullText : null}
              </button>
            )}

            {/* manual 50 */}

            {!isFullLicence && has_manual_50cc && (
              <button
                className={classnames(
                  styles.bikeHireBtn,
                  isWidget && styles.widgetBtn,
                  bike_hire === BIKE_HIRE.MANUAL_50CC && styles.activeBtn
                )}
                onClick={() =>
                  onUpdate({
                    bike_hire: BIKE_HIRE.MANUAL_50CC,
                    selectedLicenceType: null,
                    selectedPackageDays: '',
                    selectedPackageDates: []
                  })
                }
                disabled={isManual50Full || !isManual50Available}>
                {getMotorbikeLabel(BIKE_HIRE.MANUAL_50CC, isFullLicence)}{' '}
                {isCbtRenewal && ` £${course.bike_hire_cost / 100}`}
                {isManual50Full ? fullText : null}
              </button>
            )}
          </div>
          {isCbt &&
            ['manual', BIKE_HIRE.MANUAL_50CC].includes(bike_hire) &&
            !isItm &&
            manualText}
          {isFullLicence &&
            !has_manual_bikes &&
            !has_auto_bikes &&
            !loading && <div>No bikes available</div>}
        </div>
      </Loading>
    )
  }
)

export default BikePicker
