import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'

import CoursesPanel from './CoursesPanel'
import CoursesPanelItem from './CoursesPanelItem'

import { Provider } from 'react-redux'
import configureStore from '../../../store'

Enzyme.configure({ adapter: new Adapter() })

const COURSES = [
  {
    id: 1,
    course_type: {
      id: 1,
      name: 'CBT Training'
    },
    date: '2018-07-25',
    time: '08:00:00',
    spaces: 4,
    orders: [
      {
        id: '67ca8d4c-a617-4c5e-8fd0-80fe33fd2031',
        friendly_id: 1367,
        user_name: 'Test'
      },
      {
        id: '8f5e12f9-db74-42fc-845f-37d0e9b80c73',
        friendly_id: 1366,
        user_name: 'C C'
      }
    ],
    supplier: 697
  },
  {
    id: 2,
    course_type: {
      id: 2,
      name: 'CBT Training'
    },
    date: '2018-07-25',
    time: '09:00:00',
    spaces: 2,
    orders: [
      {
        id: '67ca8d4c-a617-4c5e-8fd0-80fe33fd2031',
        friendly_id: 1368,
        user_name: 'Test'
      },
      {
        id: '8f5e12f9-db74-42fc-845f-37d0e9b80c73',
        friendly_id: 1367,
        user_name: 'C C'
      }
    ],
    supplier: 697
  }
]

it('Renders courses list', () => {
  const store = configureStore()

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <CoursesPanel courses={COURSES} date="2018-01-01" />
      </MemoryRouter>
    </Provider>
  )

  const rows = wrapper.find(CoursesPanelItem)
  expect(rows).toHaveLength(COURSES.length)
})
