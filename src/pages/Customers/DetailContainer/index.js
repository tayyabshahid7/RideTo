import React from 'react'
import { Row, Col } from 'reactstrap'

import commonStyles from 'pages/styles.scss'
import DetailFormContainer from 'pages/Customers/DetailFormContainer'
import OrderListContainer from 'pages/Customers/OrderListContainer'

class CustomerDetailContainer extends React.Component {
  render() {
    const { match, history } = this.props
    const { id } = match.params

    return (
      <div className={commonStyles.mainContent}>
        <h1>Customer Information</h1>

        <Row>
          <Col>
            <DetailFormContainer id={id} history={history} />
          </Col>
          <Col>
            <OrderListContainer id={id} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default CustomerDetailContainer
