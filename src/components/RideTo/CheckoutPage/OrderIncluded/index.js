import classnames from 'classnames'
import React from 'react'
import { getMotorbikeLabel } from 'services/widget'
import { capitalizeFirstLetter } from 'utils/helper'
import styles from './styles.scss'

function OrderIncluded({
  bikeHire,
  helmetHire,
  pom = false,
  hasGloves,
  package_hours,
  fullLicence = false,
  isWidget = false,
  items,
  popup = false
}) {
  if (items) {
    return (
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          {items.map(item => (
            <li key={item}>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (pom) {
    return (
      <div className={classnames(styles.wrapper, popup && styles.popUp)}>
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>Covers failure to complete CBT*</span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              <strong>We'll pay for your 2nd day</strong> if you need it
            </span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              <strong>Save over £150 </strong> on extra training costs
            </span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>Recommend for new riders</span>
          </li>
        </ul>
      </div>
    )
  }

  if (fullLicence) {
    return (
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>Bike hire and fuel</span>
          </li>
          {helmetHire && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>Helmet provided</span>
            </li>
          )}
          {hasGloves && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>Gloves and jacket provided</span>
            </li>
          )}
          {package_hours !== 16 && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>
                Test fees and escort to and from test centres
              </span>
            </li>
          )}
          {/* {!isWidget && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>
                12 working day free cancellation
              </span>
            </li>
          )} */}
        </ul>
      </div>
    )
  }

  const noBike = ['no', 'none', 'BIKE_HIRE_NONE'].includes(bikeHire)

  return (
    <div className={styles.wrapper}>
      {noBike ? (
        <p>Own bike, helmet and gloves required</p>
      ) : (
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              {capitalizeFirstLetter(getMotorbikeLabel(bikeHire, fullLicence))}{' '}
              hire
            </span>
          </li>
          {helmetHire && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>Helmet provided</span>
            </li>
          )}
          {hasGloves && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>Gloves and jacket provided</span>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default OrderIncluded
