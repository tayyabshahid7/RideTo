import React, { Fragment } from 'react'
import moment from 'moment'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import MapComponent from 'components/RideTo/MapComponent'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import POMSelector from 'components/RideTo/CheckoutPage/POMSelector'
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
  const { courseType, date, bike_hire, gloves_jacket_included } = checkoutData
  const requested_time =
    trainings && trainings[0] && trainings[0].requested_time
  const lat = parseFloat(window.RIDETO_PAGE.checkout.supplier.latitude)
  const lng = parseFloat(window.RIDETO_PAGE.checkout.supplier.longitude)
  const isFullLicence = courseType === 'FULL_LICENCE'
  const offersPOM = ['LICENCE_CBT_RENEWAL', 'LICENCE_CBT'].includes(courseType)

  return (
    <Fragment>
      <div className={styles.rowContainer}>
        {isFullLicence && (
          <div className="mb-2">
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
          <div className={styles.coursePrice}>
            <div>{getCourseTitle(courseType)}</div>
            {priceInfo.training_price && (
              <div>{`£${(priceInfo.training_price / 100.0).toFixed(2)}`}</div>
            )}
          </div>
        )}

        {!isFullLicence && (
          <div className={styles.dateLimit}>
            <div>
              <div>
                {moment(date).format('ddd D MMMM')}: {requested_time}
              </div>
            </div>
            <div className={styles.limitedWarning}>Limited spaces left</div>
          </div>
        )}

        <div>
          <button className={styles.mapButton} onClick={handleMapButtonClick}>
            {`${supplier.address_1}, ${supplier.postcode}`}
          </button>
          {showMap && (
            <MapComponent
              userLocation={{ lat, lng }}
              width={'auto'}
              height={200}
              checkout
            />
          )}
        </div>

        <OrderIncluded
          bikeHire={bike_hire}
          hasGloves={gloves_jacket_included}
        />

        {priceInfo.bike_hire_cost > 0 && bike_hire !== 'no' ? (
          <div className={styles.bikeHireCost}>
            {renderRow(
              'Bike Hire Cost',
              `£${(priceInfo.bike_hire_cost / 100.0).toFixed(2)}`,
              101
            )}
          </div>
        ) : null}
      </div>
      {offersPOM ? (
        <POMSelector
          handlePOMToggleClick={handlePOMToggleClick}
          hasPOM={hasPOM}
        />
      ) : (
        <div className={styles.POMPlaceholder} />
      )}
    </Fragment>
  )
}

export default CourseInformation
