import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import customers from 'json/customers.json'

import CustomerList from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Renders rows', () => {
  const wrapper = shallow(<CustomerList customers={customers} />)

  expect(wrapper.find('tr').length).toBe(customers.length + 1)
})

it('Renders link to customers', () => {
  const wrapper = shallow(<CustomerList customers={customers} />)
  const expected = `/customers/${customers[0].id}`

  expect(
    wrapper
      .find('Link')
      .first()
      .prop('to')
  ).toBe(expected)
})
