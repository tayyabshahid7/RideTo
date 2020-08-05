import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Instructors from './Instructors'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
    instructors: {
      1: [],
      2: []
    },
    schoolId: 1,
    newInstructor: jest.fn()
  }
  wrapper = shallow(<Instructors {...props} />)
})

it('Click add new should render Modal', () => {
  wrapper.find('Button#btnNewInstructor').simulate('click')

  expect(wrapper.find('Modal')).toHaveLength(1)
})

it('Click add new should render Modal', () => {
  props.newInstructor.mockReset()
  wrapper.find('Button#btnNewInstructor').simulate('click')
  wrapper
    .find('form#instructorForm')
    .simulate('submit', { preventDefault: jest.fn() })
  expect(props.newInstructor).toHaveBeenCalled()
})
