import React, { Fragment } from 'react'
import moment from 'moment'
import styles from './styles.scss'
import { getCourseTitle } from 'services/course'
import MapComponent from 'components/RideTo/MapComponent'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
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
    course
  } = checkoutData
  const { helmet_hire, on_site_cafe, indoor_classroom } = course
  const requested_time =
    trainings && trainings[0] && trainings[0].requested_time
  const lat = parseFloat(window.RIDETO_PAGE.checkout.supplier.latitude)
  const lng = parseFloat(window.RIDETO_PAGE.checkout.supplier.longitude)
  const isFullLicence = courseType === 'FULL_LICENCE'

  return (
    <Fragment>
      <div className={styles.rowContainer}>
        <div className={styles.orderTopSection}>
          <OrderIncluded
            bikeHire={bike_hire}
            hasGloves={gloves_jacket_included}
            helmetHire={helmet_hire}
            onSiteCafe={on_site_cafe}
            indoorClassroom={indoor_classroom}
          />

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

        {!isFullLicence &&
          renderRow(
            'Date & Time',
            `${moment(date).format('ddd D MMMM')}: ${requested_time}`
          )}
        <div className={styles.limitedWarning}>
          <span>Last few spaces</span>
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
      </div>
    </Fragment>
  )
}

export default CourseInformation
