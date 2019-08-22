import React, { Fragment } from 'react'
import styles from './styles.scss'
import UpComingCourse from '../UpComingCourse'

function MyOrders({ orders, handleClick }) {
  return (
    <Fragment>
      <div className={styles.container}>
        <h2 className={styles.title}>My orders</h2>
        {orders.length > 0 ? (
          <ul className={styles.list}>
            {orders.map(order => (
              <li key={order.friendly_id}>
                <UpComingCourse
                  course={order}
                  title={`Order #${order.friendly_id}`}
                  handleClick={handleClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noOrders}>No orders yet</p>
        )}
      </div>
    </Fragment>
  )
}

export default MyOrders
