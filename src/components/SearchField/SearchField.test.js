import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SearchField from './index'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
    onSearch: jest.fn(),
    placeholder: ''
  }
  wrapper = shallow(<SearchField {...props} />)
})

it('Enter should call onSearch', () => {
  wrapper.find('Input').simulate('keypress', { key: 'Enter' })
  expect(props.onSearch).toHaveBeenCalled()
})

it('Button click should call onSearch with value', () => {
  wrapper.find('Input').simulate('change', { target: { value: 'value' } })
  wrapper.find('Button').simulate('click')
  expect(props.onSearch).toHaveBeenCalledWith('value')
})
