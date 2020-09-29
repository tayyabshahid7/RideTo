import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CalendarLabels from './CalendarLabels'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
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
        colour: '#000',
        supplier: [1]
      }
    ],
    loadCourseTypes: jest.fn(),
    schoolId: 1
  }
  wrapper = shallow(<CalendarLabels {...props} />)
})

it('Load functions should be called', () => {
  expect(props.loadCourseTypes).toHaveBeenCalled()
})

it('Button should be disabled by default', () => {
  expect(wrapper.find('Button').prop('disabled')).toBe(true)
})

it('Change color should enable the button', () => {
  wrapper.find('input[type="color"]').simulate('change', {
    target: { value: '#FF0000' }
  })

  expect(wrapper.find('Button').prop('disabled')).toBe(false)
})
