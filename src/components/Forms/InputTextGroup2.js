import React from 'react'
// import Input from 'components/Forms/Input'
import { Col, FormGroup, Label, Input } from 'reactstrap'
import classnames from 'classnames'

import styles from './InputTextGroup.scss'

const InputTextGroup = ({
  name,
  value,
  onChange,
  label,
  inputClass = '',
  className = '',
  inputType = 'text',
  children = null,
  labelSize = 2,
  ...rest
}) => (
  <FormGroup row>
    <Label className="control-label" sm={labelSize}>
      {label}
    </Label>
    <Col sm={12 - labelSize}>
      {children ? (
        children
      ) : (
        <Input
          type={inputType}
          name={name}
          className={classnames(styles.input, inputClass)}
          onChange={onChange}
          value={value}
          {...rest}
        />
      )}
    </Col>
  </FormGroup>
)

export default InputTextGroup
