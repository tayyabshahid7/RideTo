import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ConfirmedOrders from './index'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
    sortingChange: jest.fn(),
    confirmedOrders: [
      {
        id: 34650,
        full_licence_type: 'FULL_LICENCE_TYPE_NONE',
        bike_type: 'BIKE_TYPE_AUTO',
        status: 'TRAINING_CONFIRMED',
        training_date_time: '2020-06-07T11:00:00Z',
        rider_feedback_notes: '',
        course_type: 'LICENCE_CBT',
        school_course: 51973,
        training_location: 44,
        order: {
          id: '8df4b4d3-99f6-46c2-8c85-9c412aa35b2c',
          friendly_id: 34977,
          direct_friendly_id: '#34977',
          status: 'CONFIRMED',
          payment_status: 'PAID'
        },
        customer: {
          id: 27923,
          school_profile: 25,
          first_name: 'Thomas',
          last_name: 'Ashman',
          full_name: 'Thomas Ashman',
          phone: '+447969051873',
          email: 'tomarsenal@hotmail.com',
          licence_number: null,
          birthdate: '1992-12-24',
          riding_experience: 'On road motorcycling'
        },
        requested_date: '2020-06-07'
      },
      {
        id: 34635,
        full_licence_type: 'FULL_LICENCE_TYPE_NONE',
        bike_type: 'BIKE_TYPE_AUTO',
        status: 'TRAINING_CONFIRMED',
        training_date_time: '2020-06-07T11:00:00Z',
        rider_feedback_notes: '',
        course_type: 'LICENCE_CBT',
        school_course: 51973,
        training_location: 44,
        order: {
          id: 'fe5031da-3ed3-4004-ad30-9cba05c5801e',
          friendly_id: 34962,
          direct_friendly_id: '#34962',
          status: 'CONFIRMED',
          payment_status: 'PAID'
        },
        customer: {
          id: 27909,
          school_profile: 25,
          first_name: 'Zai',
          last_name: 'Kumje',
          full_name: 'Zai Kumje',
          phone: '+447540178212',
          email: 'zaidankumje@googlemail.com',
          licence_number: null,
          birthdate: '1984-07-19',
          riding_experience: 'Cycling experience'
        },
        requested_date: '2020-06-07'
      }
    ]
  }
  wrapper = shallow(<ConfirmedOrders {...props} />)
})

it('Should render 2 order items', () => {
  expect(wrapper.find('tbody tr')).toHaveLength(2)
})

// it('Click on header cell should call sortingChange', () => {
//   wrapper
//     .find('thead Header')
//     .at(0)
//     .simulate('click')
//   expect(props.sortingChange).toHaveBeenCalled()
// })
