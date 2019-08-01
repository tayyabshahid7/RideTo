import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import SidePanel from 'components/RideTo/SidePanel'
import BookingCompleteBanner from 'components/RideTo/Account/BookingCompleteBanner'
import OrderDetails from 'components/RideTo/Account/OrderDetails'
import DashboardChecklist from 'components/RideTo/Account/DashboardChecklist'
import DashboardAdvice from 'components/RideTo/Account/DashboardAdvice'
import DashboardOrders from 'components/RideTo/Account/DashboardOrders'
import DashboardReferral from 'components/RideTo/Account/DashboardReferral'
import { fetchOrder, fetchOrders, getChecklist } from 'services/user'
import { getUserProfile, getToken, isAuthenticated } from 'services/auth'
import { getDashboardAdvice } from 'services/page'
import styles from './DashboardPage.scss'
import POMBanner from 'components/RideTo/ResultPage/POMBanner'

class DashboardPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recentOrder: null,
      selectedOrder: null,
      orders: []
    }

    this.handleDetails = this.handleDetails.bind(this)
    this.recordGAEcommerceData = this.recordGAEcommerceData.bind(this)
  }

  async componentDidMount() {
    const { params } = this.props.match
    const { orderId } = params
    if (orderId) {
      this.loadSingleOrder(orderId)
      const next = `/account/dashboard/${orderId}`
      window.sessionStorage.setItem('login-next', JSON.stringify(next))
    }
    if (isAuthenticated()) {
      const user = getUserProfile(getToken())
      if (user) {
        this.loadOrders(user.username)
      }
    }
  }

  async loadSingleOrder(orderId) {
    const recentOrder = await fetchOrder(orderId)
    this.setState(
      { recentOrder },
      () => this.recordGAEcommerceData(this.state.recentOrder) //Ecommerce tracking trigger
    )
  }

  async loadOrders(username) {
    const result = await fetchOrders(username)
    this.setState({
      orders: result.results
    })
  }

  handleDetails(selectedOrder) {
    this.setState({ selectedOrder })
  }

  recordGAEcommerceData(order) {
    if (order && window.localStorage.getItem('gaok') === 'true') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        transactionId: order.friendly_id,
        transactionAffiliation: 'RideTo',
        transactionTotal: order.revenue,
        transactionProducts: [
          {
            sku: order.friendly_id,
            name: order.selected_licence,
            category: order.supplier_name,
            price: order.revenue,
            quantity: 1
          }
        ],
        event: 'rideto.ecom-purchase.completed'
      })
      window.localStorage.removeItem('gaok')
    }
  }

  render() {
    const { recentOrder, selectedOrder, orders } = this.state
    const headingImage = selectedOrder
      ? selectedOrder.training_location.image
      : ''
    const needsPom = true

    return (
      <React.Fragment>
        {recentOrder && (
          <BookingCompleteBanner
            order={recentOrder}
            onDetails={this.handleDetails}
          />
        )}
        <Container className={styles.dashboardPage}>
          <Row>
            <Col sm="4">
              <DashboardChecklist items={getChecklist()} />
              {orders.length > 0 && (
                <DashboardOrders
                  orders={orders}
                  onDetails={this.handleDetails}
                />
              )}
            </Col>
            <Col sm="8">
              {needsPom && (
                <a
                  href="https://rideto.typeform.com/to/u1Wxve"
                  target="_blank"
                  rel="noopener noreferrer">
                  <POMBanner discount />
                </a>
              )}
              <DashboardReferral />
              <DashboardAdvice items={getDashboardAdvice()} />
            </Col>
          </Row>
        </Container>
        <SidePanel
          visible={selectedOrder !== null}
          headingImage={headingImage}
          onDismiss={() => this.handleDetails(null)}>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default DashboardPage
