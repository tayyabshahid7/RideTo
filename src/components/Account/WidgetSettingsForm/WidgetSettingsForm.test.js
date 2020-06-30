import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import WidgetSettingsForm from './index'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {}
  wrapper = shallow(<WidgetSettingsForm {...props} />)
})

it('All save buttons should be disabled', () => {
  wrapper.find('Button[type="submit"]').forEach(node => {
    expect(node.prop('disabled')).toEqual(true)
  })
})

it('Change widget color should enable save buttons', () => {
  wrapper
    .find('input[name="widgetColor"]')
    .simulate('change', { target: { value: '#000000' } })

  wrapper.find('Button[type="submit"]').forEach(node => {
    expect(node.prop('disabled')).toEqual(false)
  })
})

it('ConnectTextArea intro should be disabled by default', () => {
  expect(
    wrapper.find('ConnectTextArea[name="intro"]').prop('disabled')
  ).toEqual(true)
})

it('Clicking edit should enable ConnectTextArea', () => {
  wrapper.find('Button[name="introLink"]').simulate('click', 'intro')
  expect(
    wrapper.find('ConnectTextArea[name="intro"]').prop('disabled')
  ).toEqual(false)
})
