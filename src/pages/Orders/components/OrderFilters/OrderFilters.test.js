import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import OrderFilters from 'pages/Orders/components/OrderFilters'

Enzyme.configure({ adapter: new Adapter() })

const FILTERS = [
  {
    name: 'Today'
  },
  {
    name: 'This Week'
  }
]

it('Renders Filters', () => {
  const wrapper = mount(
    <OrderFilters filters={FILTERS} selectedFilter={FILTERS[1]} />
  )

  const filter = wrapper.find('button').at(1)
  expect(filter.text()).toBe(FILTERS[1].name)
  expect(filter.hasClass('active')).toBe(true)
})

it('Fires DateFilter event', () => {
  const onDateFilter = jest.fn()
  const wrapper = mount(
    <OrderFilters onDateFilter={onDateFilter} filters={FILTERS} />
  )

  wrapper
    .find('button')
    .first()
    .simulate('click')

  expect(onDateFilter).toHaveBeenCalledWith(FILTERS[0])
})
