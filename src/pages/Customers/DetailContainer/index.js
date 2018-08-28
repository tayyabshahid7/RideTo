import React from 'react'
import { Row, Col } from 'reactstrap'

import commonStyles from 'pages/styles.scss'
import DetailFormContainer from 'pages/Customers/DetailFormContainer'

class CustomerDetailContainer extends React.Component {
  render() {
    const { match } = this.props
    const { id } = match.params

    return (
      <div className={commonStyles.mainContent}>
        <h1>Customer Information</h1>

        <Row>
          <Col>
            <DetailFormContainer id={id} />
          </Col>
          <Col>
            <h2>Orders</h2>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CustomerDetailContainer
