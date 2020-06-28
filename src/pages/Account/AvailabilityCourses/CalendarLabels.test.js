import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CalendarLabels from './CalendarLabels'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  info: {
    ridingExperiences: [
      {
        value: 'Cycling experience',
        title: 'Cycling experience'
      }
    ],
    courseTypes: []
  },
  instructors: [
    {
      id: 1,
      first_name: 'Jack',
      last_name: 'Smith',
      colour: '#000'
    }
  ],
  getInstructors: jest.fn(),
  loadCourseTypes: jest.fn(),
  schoolId: 1
}

it('Load functions should be called', () => {
  shallow(<CalendarLabels {...defaultProps} />)

  expect(defaultProps.loadCourseTypes).toHaveBeenCalled()
  expect(defaultProps.getInstructors).toHaveBeenCalledTimes(0)
})

it('Button should be disabled by default', () => {
  const wrapper = shallow(<CalendarLabels {...defaultProps} />)

  expect(wrapper.find('Button').prop('disabled')).toBe(true)
})

it('Change color should enable the button', () => {
  const wrapper = shallow(<CalendarLabels {...defaultProps} />)
  wrapper.find('input[type="color"]').simulate('change', {
    target: { value: '#FF0000' }
  })

  expect(wrapper.find('Button').prop('disabled')).toBe(false)
})
