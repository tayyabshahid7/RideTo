import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CreateBulkCourse from './index'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
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
    schoolId: 1,
    saving: false,
    error: null
  }
  wrapper = shallow(<CreateBulkCourse {...props} />)
})

it('Cancel should collapse the form', () => {
  expect(wrapper.find('Button[type="button"]').exists()).toEqual(true)

  wrapper
    .find('Button[type="button"]')
    .simulate('click', { preventDefault: jest.fn() })
  expect(props.handleCancel).toHaveBeenCalled()
})

it('Shoud render submit button and prevent submitting', () => {
  expect(wrapper.find('Button[type="submit"]').exists()).toEqual(true)

  wrapper.find('Button[type="submit"]').simulate('click')
  expect(props.onSubmit).toHaveBeenCalledTimes(0)
})

it('Submit button should submit the form', () => {
  wrapper.find('ConnectInput[name="spaces"]').simulate('change', {
    target: {
      name: 'spaces',
      value: '2'
    }
  })

  wrapper.find('ConnectInput[name="start_date"]').simulate('change', {
    target: {
      name: 'start_date',
      value: '2020-06-01'
    }
  })

  wrapper.find('ConnectInput[name="end_date"]').simulate('change', {
    target: {
      name: 'end_date',
      value: '2020-06-10'
    }
  })

  wrapper.find('ConnectInput[name="time"]').simulate('change', {
    target: {
      name: 'time',
      value: '02:00'
    }
  })

  wrapper.find('ConnectInput[name="end_time"]').simulate('change', {
    target: {
      name: 'end_time',
      value: '06:00'
    }
  })

  wrapper.find('Form').simulate('submit', { preventDefault: jest.fn() })
  expect(props.onSubmit).toHaveBeenCalledTimes(1)
})
