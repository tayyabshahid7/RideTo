import React from 'react'
import { Row, Col } from 'reactstrap'

const CustomerDetailForm = ({ customer }) => {
  return (
    <div>
      <Row>
        <Col>{customer.phone}</Col>
        <Col>{customer.birthdate}</Col>
      </Row>
    </div>
  )
}

export default CustomerDetailForm
