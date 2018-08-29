import React from 'react'
import moment from 'moment'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AgeInput from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Sets correct age', () => {
  const wrapper = mount(<AgeInput onChange={jest.fn()} />)

  expect(wrapper.find('InputGroupText').text()).toBe('- Years')
  wrapper.setProps({ value: moment('2017-01-01', 'YYYY-MM-DD') })
  expect(wrapper.find('InputGroupText').text()).toBe('1 Year')
  wrapper.setProps({ value: moment('2000-01-01', 'YYYY-MM-DD') })
  expect(wrapper.find('InputGroupText').text()).toBe('18 Years')
})
