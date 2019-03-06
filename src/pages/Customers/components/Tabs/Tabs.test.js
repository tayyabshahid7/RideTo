import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Tabs from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Renders correct number of tabs', () => {
  const wrapper = shallow(
    <Tabs>
      <div label="1">1</div>
      <div label="2">2</div>
      <div label="3">3</div>
    </Tabs>
  )

  expect(wrapper.find('.tab').length).toBe(3)
})

it('Renders correct tab label', () => {
  const wrapper = shallow(
    <Tabs>
      <div label="test1">1</div>
      <div label="test2">2</div>
    </Tabs>
  )

  expect(
    wrapper
      .find('.tab')
      .first()
      .text()
  ).toBe('test1')
})

it('Renders correct number of panels', () => {
  const wrapper = shallow(
    <Tabs>
      <div label="1">1</div>
      <div label="2">2</div>
      <div label="3">3</div>
      <div label="4">4</div>
    </Tabs>
  )

  expect(wrapper.find('.panel').length).toBe(4)
})

it('Changes active tab on click', () => {
  const wrapper = shallow(
    <Tabs>
      <div label="1">1</div>
      <div label="2">2</div>
    </Tabs>
  )

  expect(
    wrapper
      .find('.panel')
      .first()
      .hasClass('showPanel')
  ).toBe(true)
  wrapper
    .find('.tabButton')
    .at(1)
    .simulate('click')
  expect(
    wrapper
      .find('.panel')
      .first()
      .hasClass('showPanel')
  ).toBe(false)
  expect(
    wrapper
      .find('.panel')
      .at(1)
      .hasClass('showPanel')
  ).toBe(true)
})
