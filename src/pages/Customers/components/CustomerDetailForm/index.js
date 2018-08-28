import React from 'react'
import moment from 'moment'
import {
  Button,
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

import styles from './CustomerDetailForm.scss'

const getAge = birthdate => {
  const age = birthdate
    ? moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years')
    : '-'

  return `${age} Years`
}

class CustomerDetailForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.customer || {}
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange({ target }) {
    const { editable } = this.state
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState({ editable: { ...editable, [name]: value } })
  }

  render() {
    const { onSave } = this.props
    const { editable } = this.state

    return (
      <div>
        <Row>
          <Col>
            <InputTextGroup
              name="phone"
              value={editable.phone || ''}
              label="Phone"
              className="form-group"
              type="phone"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup label="Birth Date" className="form-group">
              <InputGroup>
                <Input
                  name="birthdate"
                  value={editable.birthdate || ''}
                  type="date"
                  onChange={this.handleChange}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>{getAge(editable.birthdate)}</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </InputTextGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="current_licence"
              value={editable.current_licence || ''}
              label="Licence Held"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup
              name="licence_number"
              value={editable.licence_number || ''}
              label="Licence Number"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="national_insurance_number"
              value={editable.national_insurance_number || ''}
              label="National Insurance"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup
              name="riding_experience"
              value={editable.riding_experience || ''}
              label="Riding Experience"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="email"
              value={editable.email || ''}
              label="Email"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup
              name="cbt_passed_date"
              value={editable.cbt_passed_date || ''}
              label="CBT Passed Date"
              className="form-group"
              type="date"
              onChange={this.handleChange}
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
                checked={editable.email_optin || false}
                onChange={this.handleChange}
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
                value={editable.notes}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className={styles.actions}>
            <Button color="primary" onClick={() => onSave(editable)}>
              Save
            </Button>
            <Button color="outline">Cancel</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CustomerDetailForm
