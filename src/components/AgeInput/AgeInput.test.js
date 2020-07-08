import React from 'react'
import moment from 'moment'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AgeInput from './index'

Enzyme.configure({ adapter: new Adapter() })

let wrapper

beforeEach(() => {
  wrapper = mount(<AgeInput onChange={jest.fn()} />)
})

it('Sets correct age', () => {
  expect(wrapper.find('InputGroupText').text()).toBe('- Years')

  const dob1 = moment('2017-01-01', 'YYYY-MM-DD')
  const age1 = moment().diff(dob1, 'years', false)
  wrapper.setProps({ value: dob1 })
  expect(wrapper.find('InputGroupText').text()).toBe(`${age1} Years`)

  const dob2 = moment('2000-01-01', 'YYYY-MM-DD')
  const age2 = moment().diff(dob2, 'years', false)
  wrapper.setProps({ value: dob2 })
  expect(wrapper.find('InputGroupText').text()).toBe(`${age2} Years`)
})
