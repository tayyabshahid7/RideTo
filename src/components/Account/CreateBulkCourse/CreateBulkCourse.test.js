import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CreateBulkCourse from './index'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  onSubmit: jest.fn(),
  loadCourseTypes: jest.fn(),
  getInstructors: jest.fn(),
  handleCancel: jest.fn(),
  info: {
    ridingExperiences: [
      {
        value: 'Cycling experience',
        title: 'Cycling experience'
      },
      {
        value: 'On road motorcycling',
        title: 'On road motorcycling'
      },
      {
        value: 'Off road motorcycling',
        title: 'Off road motorcycling'
      }
    ],
    courseTypes: [
      {
        id: 6,
        constant: 'TFL_ONE_ON_ONE',
        name: 'FREE 1-2-1 Motorcycle Skills',
        slug: '1-2-1-motorcycle-skills'
      },
      {
        id: 7,
        constant: 'FULL_LICENCE_MOD1_TRAINING',
        name: 'Full Licence Module 1 Training',
        slug: 'module-1-training'
      },
      {
        id: 8,
        constant: 'FULL_LICENCE_MOD2_TRAINING',
        name: 'Full Licence Module 2 Training',
        slug: 'module-2-training'
      }
    ]
  },
  instructors: [
    {
      id: 204,
      first_name: 'Nathan',
      last_name: 'Brown',
      supplier: 44,
      colour: '#2CCEAC',
      diary: []
    }
  ],
  schools: [
    {
      id: 44,
      name: 'IPASS CBT Osterley',
      town: 'Osterley'
    }
  ],
  available_days: ['T', 'T', 'T', 'T', 'T', 'T', 'T'],
  saving: false,
  error: null
}

it('Shoud render submit button and prevent submitting', () => {
  const wrapper = shallow(<CreateBulkCourse {...defaultProps} />)

  expect(wrapper.find('Button[type="submit"]').exists()).toEqual(true)

  wrapper.find('Button[type="submit"]').simulate('click')
  expect(defaultProps.onSubmit).toHaveBeenCalledTimes(0)
})

it('Cancel should collapse the form', () => {
  const wrapper = shallow(<CreateBulkCourse {...defaultProps} />)

  expect(wrapper.find('Button[type="button"]').exists()).toEqual(true)

  wrapper
    .find('Button[type="button"]')
    .simulate('click', { preventDefault: jest.fn() })
  expect(defaultProps.handleCancel).toHaveBeenCalled()
})
