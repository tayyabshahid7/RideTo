import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import SidePanel from 'components/RideTo/SidePanel'
import BookingCompleteBanner from 'components/RideTo/Account/BookingCompleteBanner'
import OrderDetails from 'components/RideTo/Account/OrderDetails'
import DashboardChecklist from 'components/RideTo/Account/DashboardChecklist'
import DashboardAdvice from 'components/RideTo/Account/DashboardAdvice'
import DashboardOrders from 'components/RideTo/Account/DashboardOrders'
import { fetchOrder, fetchOrders, getChecklist } from 'services/user'
import { getUserProfile, getToken, isAuthenticated } from 'services/auth'
import { getDashboardAdvice } from 'services/page'
import styles from './DashboardPage.scss'

class DashboardPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recentOrder: null,
      selectedOrder: null,
      orders: []
    }

    this.handleDetails = this.handleDetails.bind(this)
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
    this.setState({
      recentOrder
    })
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

  render() {
    const { recentOrder, selectedOrder, orders } = this.state
    const headingImage = selectedOrder
      ? selectedOrder.training_location.image
      : ''
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
