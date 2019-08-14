import React, { Fragment, useState } from 'react'
import styles from './styles.scss'
import UpComingCourse from '../UpComingCourse'
import SidePanel from 'components/RideTo/SidePanel'
import OrderDetails from 'components/RideTo/Account/OrderDetails'

function MyOrders({ orders }) {
  console.log(orders)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const headingImage = selectedOrder
    ? selectedOrder.training_location.image
    : ''

  const handleClick = course => {
    setSelectedOrder(course)
  }

  const handleCloseClick = () => {
    setSelectedOrder(null)
  }

  return (
    <Fragment>
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
      <SidePanel
        visible={selectedOrder}
        headingImage={headingImage}
        onDismiss={handleCloseClick}>
        {selectedOrder && <OrderDetails order={selectedOrder} />}
      </SidePanel>
    </Fragment>
  )
}

export default MyOrders
