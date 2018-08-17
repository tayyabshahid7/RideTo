import React from 'react'
import moment from 'moment'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import DateInput from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Emits error with young age', () => {
  const onError = jest.fn()
  const onChange = jest.fn()
  const wrapper = shallow(
    <DateInput
      onChange={onChange}
      onError={onError}
      minYears={16}
      today={moment('2018-01-01', 'YYYY-MM-DD')}
    />
  )

  wrapper.instance().handleChange({ target: { value: '01/01/2017' } })
  expect(onError).toHaveBeenCalled()
  expect(onChange).toHaveBeenCalled()
})

it('Emits change with valid date', () => {
  const onError = jest.fn()
  const onChange = jest.fn()
  const wrapper = shallow(
    <DateInput
      onChange={onChange}
      onError={onError}
      minYears={16}
      today={moment('2018-01-01', 'YYYY-MM-DD')}
    />
  )

  wrapper.instance().handleChange({ target: { value: '01/01/1917' } })
  expect(onChange).toHaveBeenCalled()
  expect(onError).not.toHaveBeenCalled()
})

it('Renders', () => {
  const onChange = jest.fn()
  const wrapper = shallow(<DateInput onChange={onChange} value="19/01/2000" />)

  expect(wrapper.find('MaskedInput').prop('value')).toBe('19/01/2000')
})
