import React from 'react'
import { Button, Label, Row, Col, Input, FormGroup } from 'reactstrap'

import styles from './CustomerDetailForm.scss'
import Checkbox from 'components/Checkbox'
import InputTextGroup from 'components/Forms/InputTextGroup'
import AgeInput from 'components/AgeInput'
import MinimalSelect from 'components/MinimalSelect'
import {
  getRidingExperienceOptions,
  getCurrentLicenceOptions
} from 'services/customer'

class CustomerDetailForm extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange({ target }) {
    const { customer, onChange } = this.props
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    onChange({ ...customer, [name]: value })
  }

  render() {
    const { customer, onChange, onSave, onCancel } = this.props

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
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <FormGroup>
              <Label>Birth Date</Label>
              <AgeInput
                name="birthdate"
                value={customer.birthdate || ''}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <div className="form-group">
              <Label for="current_licence">Current Licence</Label>
              <MinimalSelect
                options={getCurrentLicenceOptions()}
                selected={customer.current_licence}
                onChange={value =>
                  onChange({ ...customer, current_licence: value })
                }
              />
            </div>
          </Col>
          <Col sm="6">
            <InputTextGroup
              name="licence_number"
              value={customer.licence_number || ''}
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
              value={customer.national_insurance_number || ''}
              label="National Insurance"
              className="form-group"
              type="text"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm="6">
            <div className="form-group">
              <Label for="current_licence">Riding Experience</Label>
              <MinimalSelect
                options={getRidingExperienceOptions()}
                selected={customer.riding_experience}
                onChange={value =>
                  onChange({ ...customer, riding_experience: value })
                }
              />
            </div>
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
              onChange={this.handleChange}
            />
          </Col>
          <Col>
            <InputTextGroup
              name="cbt_passed_date"
              value={customer.cbt_passed_date || ''}
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
                checked={customer.email_optin || false}
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
                value={customer.notes || ''}
                onChange={this.handleChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className={styles.actions}>
            <Button color="primary" onClick={onSave}>
              Save
            </Button>
            <Button color="outline" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default CustomerDetailForm
