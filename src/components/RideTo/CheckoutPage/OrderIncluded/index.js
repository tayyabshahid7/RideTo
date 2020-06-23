import React from 'react'
import styles from './styles.scss'
import { getMotorbikeLabel } from 'services/widget'
import { capitalizeFirstLetter } from 'utils/helper'

function OrderIncluded({
  bikeHire,
  helmetHire,
  onSiteCafe,
  indoorClassroom,
  pom = false,
  hasGloves,
  fullLicence = false,
  isWidget = false,
  items
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
      <div className={styles.wrapper}>
        <ul className={styles.list}>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              Covers failure to achieve CBT on 1st day
            </span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              <strong>We'll pay for your 2nd day</strong> of training if you
              need it
            </span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              Complete <strong>peace of mind</strong> for new riders
            </span>
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
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>Helmet and gloves</span>
          </li>
          <li>
            <span className={styles.tick}>
              <i className="fa fa-check" />
            </span>{' '}
            <span className={styles.text}>
              Test fees and escort to and from test centres
            </span>
          </li>
          {!isWidget && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>
                12 working day free cancellation
              </span>
            </li>
          )}
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
          {onSiteCafe && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>On site cafe</span>
            </li>
          )}
          {indoorClassroom && (
            <li>
              <span className={styles.tick}>
                <i className="fa fa-check" />
              </span>{' '}
              <span className={styles.text}>Indoor classroom</span>
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
