import React from 'react'
import moment from 'moment'
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

const getAge = birthdate => {
  const age = birthdate
    ? moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years')
    : '-'

  return age === 1 ? `${age} Year` : `${age} Years`
}

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
