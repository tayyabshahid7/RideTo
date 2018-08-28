import React from 'react'
import moment from 'moment'
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
    const { editable, onChange } = this.props
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value

    onChange({ ...editable, [name]: value })
  }

  render() {
    const { editable, onChange, onSave, onCancel } = this.props

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
            <FormGroup>
              <Label>Birth Date</Label>
              <AgeInput
                name="birthdate"
                value={editable.birthdate || ''}
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
                selected={editable.current_licence}
                onChange={value =>
                  onChange({ ...editable, current_licence: value })
                }
              />
            </div>
          </Col>
          <Col sm="6">
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
          <Col sm="6">
            <div className="form-group">
              <Label for="current_licence">Riding Experience</Label>
              <MinimalSelect
                options={getRidingExperienceOptions()}
                selected={editable.riding_experience}
                onChange={value =>
                  onChange({ ...editable, riding_experience: value })
                }
              />
            </div>
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
                value={editable.notes || ''}
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
