import React from 'react'
import { Container, Row } from 'reactstrap'

import DetailFormContainer from 'pages/Customers/DetailFormContainer'
import OrderListContainer from 'pages/Customers/OrderListContainer'

class CustomerDetailContainer extends React.Component {
  render() {
    const { match, history } = this.props
    const { id } = match.params

    return (
      <Container>
        <h1>Customer Information</h1>

        <Row>
          <DetailFormContainer id={id} history={history} />
          <OrderListContainer id={id} />
        </Row>
      </Container>
    )
  }
}

export default CustomerDetailContainer
