import React, { Fragment } from 'react'
import moment from 'moment'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import MapComponent from 'components/RideTo/MapComponent'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import RefundInfo from 'components/RideTo/CheckoutPage/RefundInfo'
import classnames from 'classnames'

function renderRow(title, content, index, priceHighlight = false) {
  return (
    <div className={styles.rowItem} key={index}>
      <div className={styles.subtitle}>{title}</div>
      <div
        className={classnames(
          styles.content,
          priceHighlight && styles.highlightedPrice
        )}>
        {content}
      </div>
    </div>
  )
}

function CourseInformation({
  checkoutData,
  supplier,
  priceInfo,
  showMap,
  handleMapButtonClick,
  trainings,
  handlePOMToggleClick,
  hasPOM
}) {
  const {
    courseType,
    date,
    bike_hire,
    gloves_jacket_included,
    helmet_hire
  } = checkoutData
  const requested_time =
    trainings && trainings[0] && trainings[0].requested_time
  const lat = parseFloat(window.RIDETO_PAGE.checkout.supplier.latitude)
  const lng = parseFloat(window.RIDETO_PAGE.checkout.supplier.longitude)
  const isFullLicence = courseType === 'FULL_LICENCE'

  const diffDays = moment().diff(moment(date), 'days')

  return (
    <Fragment>
      <div className={styles.rowContainer}>
        <div className={styles.orderTopSection}>
          {isFullLicence && (
            <div style={{ marginTop: '1rem' }}>
              {renderRow(
                'Course',
                `Full Licence (${trainings[0].package_hours} hours)`
              )}
              {trainings.map((training, index) => {
                if (training.price) {
                  return (
                    <div key={index}>
                      {renderRow(
                        getCourseTitle(training.course_type).replace(
                          'Full Licence ',
                          ''
                        ),
                        `${training.requested_time.slice(0, -3)} ${moment(
                          training.requested_date
                        ).format('ddd D, MMMM')}`
                      )}
                    </div>
                  )
                } else {
                  return null
                }
              })}
            </div>
          )}

          {!isFullLicence && (
            <div style={{ marginTop: '1rem' }}>
              {renderRow('Course', getCourseTitle(courseType))}
            </div>
          )}
        </div>

        {!isFullLicence &&
          renderRow(
            'Date & Time',
            `${moment(date).format('ddd D MMMM')}: ${requested_time}`
          )}

        <div>
          {renderRow(
            'Location',
            <button className={styles.mapButton} onClick={handleMapButtonClick}>
              {`${supplier.address_1}, ${supplier.postcode}`}
            </button>
          )}

          {showMap && (
            <MapComponent
              userLocation={{ lat, lng }}
              width={'auto'}
              height={200}
              checkout
            />
          )}
        </div>

        {priceInfo.bike_hire_cost > 0 && bike_hire !== 'no' ? (
          <div className={styles.bikeHireCost}>
            {renderRow(
              'Bike Hire Cost',
              `£${(priceInfo.bike_hire_cost / 100.0).toFixed(2)}`,
              101
            )}
          </div>
        ) : null}
        <div className={styles.rowItem}>
          <div className={styles.subtitle}>REFUND POLICY</div>
          <div className={classnames(styles.content, styles.refundContent)}>
            {diffDays <= 3 && <RefundInfo />}
            <span>{diffDays <= 3 ? 'Non-refundable' : '100% Refundable*'}</span>
          </div>
        </div>
        <div className={styles.orderIncluded}>
          <div className={styles.subtitle}>WHAT'S INCLUDED</div>
          <OrderIncluded
            bikeHire={bike_hire}
            hasGloves={gloves_jacket_included}
            helmetHire={helmet_hire}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default CourseInformation
