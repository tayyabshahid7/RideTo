import React from 'react'
import { Row, Col } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'

const handleChange = (customer, onChange) => ({ target }) => {
  const { name, value } = target
  onChange({ ...customer, [name]: value })
}

const CustomerDetailForm = ({ customer, onChange }) => {
  const changeFn = handleChange(customer, onChange)

  return (
    <div>
      <Row>
        <Col>
          <InputTextGroup
            name="phone"
            value={customer.phone}
            label="Phone"
            className="form-group"
            type="phone"
            onChange={changeFn}
          />
        </Col>
        <Col>{customer.birthdate}</Col>
      </Row>
    </div>
  )
}

export default CustomerDetailForm
