import React, { Fragment, useState } from 'react'
import styles from './styles.scss'
import UpComingCourse from '../UpComingCourse'

const DEFAULT_LENGTH = 1

function MyOrders({ orders, handleClick }) {
  const totalLength = orders.length
  const [visibleLength, setVisibleLength] = useState(DEFAULT_LENGTH)

  const handleViewAllClick = () => {
    if (visibleLength === DEFAULT_LENGTH) {
      setVisibleLength(totalLength)
    }
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <h2 className={styles.title}>My orders</h2>
        {orders.length > 0 ? (
          <Fragment>
            <ul className={styles.list}>
              {orders.slice(0, visibleLength).map(order => (
                <li key={order.friendly_id}>
                  <UpComingCourse
                    course={order}
                    title={`Order #${order.friendly_id}`}
                    handleClick={handleClick}
                  />
                </li>
              ))}
            </ul>
            {visibleLength !== totalLength && (
              <button onClick={handleViewAllClick} className={styles.viewAll}>
                Show more
              </button>
            )}
          </Fragment>
        ) : (
          <p className={styles.noOrders}>No orders yet</p>
        )}
      </div>
    </Fragment>
  )
}

export default MyOrders