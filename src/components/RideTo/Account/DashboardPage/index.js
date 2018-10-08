import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import SidePanel from 'components/RideTo/SidePanel'
import BookingCompleteBanner from 'components/RideTo/Account/BookingCompleteBanner'
import OrderDetails from 'components/RideTo/Account/OrderDetails'
import DashboardChecklist from 'components/RideTo/Account/DashboardChecklist'
import { fetchOrder, getChecklist } from 'services/user'
import styles from './DashboardPage.scss'

class DashboardPage extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)

    this.state = {
      recentOrder: null,
      selectedOrder: null,
      orders: []
    }

    this.handleDetails = this.handleDetails.bind(this)
  }

  async componentDidMount() {
    const { match } = this.props
    const { orderId } = match.params

    if (orderId) {
      const recentOrder = await fetchOrder(orderId)
      this.setState({ recentOrder })
    }
  }

  handleDetails(selectedOrder) {
    this.setState({ selectedOrder })
  }

  render() {
    const { recentOrder, selectedOrder } = this.state
    const headingImage = selectedOrder ? selectedOrder.supplier.image : ''

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
