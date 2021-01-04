import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styles from './styles.scss'
import { fetchOrderDetailById } from 'services/order'
import OrdersDetailPanel from 'pages/Orders/components/OrdersDetailPanel'
import LoadingMask from 'components/LoadingMask'

const InvoiceOrderDetail = ({ ...props }) => {
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    async function loadOrder() {
      const { id } = props.match.params
      if (!id) {
        setLoading(false)
      }
      try {
        const result = await fetchOrderDetailById(id)
        const { customer, trainings, ...order } = result
        const data = {
          customer,
          order,
          ...trainings[0]
        }
        setOrder(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingMask loading={loading} />
      </div>
    )
  }

  const orders = []
  if (order) {
    orders.push(order)
  }
  return (
    <OrdersDetailPanel
      {...props}
      isInvoice
      isEdit
      orders={orders}
      trainingId={order.id}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoiceOrderDetail)
