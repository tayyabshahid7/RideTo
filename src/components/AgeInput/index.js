import React from 'react'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import { getAge } from 'utils/helper'

const AgeInput = ({ name, value, onChange }) => {
  return (
    <InputGroup>
      <Input name={name} value={value || ''} type="date" onChange={onChange} />
      <InputGroupAddon addonType="append">
        <InputGroupText>{getAge(value)}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default AgeInput
