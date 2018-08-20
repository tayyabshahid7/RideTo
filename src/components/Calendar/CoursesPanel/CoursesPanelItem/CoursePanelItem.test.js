import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'

import CoursesPanelItem from './index'

Enzyme.configure({ adapter: new Adapter() })

const COURSE = {
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
}

it('Renders Course title and link', () => {
  const wrapper = mount(
    <MemoryRouter>
      <CoursesPanelItem course={COURSE} date="2018-01-01" />
    </MemoryRouter>
  )

  expect(wrapper.text()).toContain('CBT Training | 2 spaces available')
  expect(
    wrapper
      .find('a')
      .at(0)
      .prop('href')
  ).toContain('/calendar/2018-01-01/courses/1/edit')
  expect(
    wrapper
      .find('a')
      .at(1)
      .prop('href')
  ).toContain('/calendar/2018-01-01/courses/1')
})

it('Renders orders list', () => {
  const wrapper = mount(
    <MemoryRouter>
      <CoursesPanelItem course={COURSE} date="2018-01-01" />
    </MemoryRouter>
  )

  const rows = wrapper.find('tr')
  expect(rows).toHaveLength(COURSE.orders.length)
})
