import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Users from './Users'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
    users: [],
    newUser: jest.fn()
  }
  wrapper = shallow(<Users {...props} />)
})

it('Click add new should render Modal', () => {
  wrapper.find('Button#btnNewUser').simulate('click')

  expect(wrapper.find('Modal')).toHaveLength(1)
})

it('Click add new should render Modal', () => {
  props.newUser.mockReset()
  wrapper.find('Button#btnNewUser').simulate('click')
  wrapper
    .find('form#userForm')
    .simulate('submit', { preventDefault: jest.fn() })
  expect(props.newUser).toHaveBeenCalled()
})
