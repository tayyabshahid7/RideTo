import React from 'react'
import styles from './styles.scss'
import UpComingCourse from '../UpComingCourse'

function MyOrders({ orders }) {
  const handleClick = course => {
    console.log(course)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My orders</h2>
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
    </div>
  )
}

export default MyOrders
