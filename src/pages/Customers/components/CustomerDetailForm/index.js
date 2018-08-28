import React from 'react'
import moment from 'moment'
import {
  Label,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup
} from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import Checkbox from 'components/Checkbox'

const handleChange = (customer, onChange) => ({ target }) => {
  const { name } = target
  const value = target.type === 'checkbox' ? target.checked : target.value

  onChange({ ...customer, [name]: value })
}

const getAge = birthdate => {
  const age = birthdate
    ? moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years')
    : '-'

  return `${age} Years`
}

const CustomerDetailForm = ({ customer, onChange }) => {
  const changeFn = handleChange(customer, onChange)

  return (
    <div>
      <Row>
        <Col>
          <InputTextGroup
            name="phone"
            value={customer.phone || ''}
            label="Phone"
            className="form-group"
            type="phone"
            onChange={changeFn}
          />
        </Col>
        <Col>
          <InputTextGroup label="Birth Date" className="form-group">
            <InputGroup>
              <Input
                name="birthdate"
                value={customer.birthdate || ''}
                type="date"
                onChange={changeFn}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>{getAge(customer.birthdate)}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </InputTextGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputTextGroup
            name="current_licence"
            value={customer.current_licence || ''}
            label="Licence Held"
            className="form-group"
            type="text"
            onChange={changeFn}
          />
        </Col>
        <Col>
          <InputTextGroup
            name="licence_number"
            value={customer.licence_number || ''}
            label="Licence Number"
            className="form-group"
            type="text"
            onChange={changeFn}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputTextGroup
            name="national_insurance_number"
            value={customer.national_insurance_number || ''}
            label="National Insurance"
            className="form-group"
            type="text"
            onChange={changeFn}
          />
        </Col>
        <Col>
          <InputTextGroup
            name="riding_experience"
            value={customer.riding_experience || ''}
            label="Riding Experience"
            className="form-group"
            type="text"
            onChange={changeFn}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputTextGroup
            name="email"
            value={customer.email || ''}
            label="Email"
            className="form-group"
            type="text"
            onChange={changeFn}
          />
        </Col>
        <Col>
          <InputTextGroup
            name="cbt_passed_date"
            value={customer.cbt_passed_date || ''}
            label="CBT Passed Date"
            className="form-group"
            type="date"
            onChange={changeFn}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="form-group">
            <Label for="email_optin">Email Opt-In</Label>
            <Checkbox
              id="email_optin"
              name="email_optin"
              checked={customer.email_optin || false}
              onChange={changeFn}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <Label>Notes</Label>
            <Input
              type="textarea"
              name="notes"
              value={customer.notes}
              onChange={changeFn}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default CustomerDetailForm
