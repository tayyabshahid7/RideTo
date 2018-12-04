import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'

import OrdersPanel from './index'
import CoursesPanelItem from '../OrdersPanelItem'
import OrdersPanelSpaceItem from './OrdersPanelSpaceItem'

Enzyme.configure({ adapter: new Adapter() })

const COURSE1 = {
  id: 1,
  course_type: {
    id: 1,
    name: 'CBT Training'
  },
  date: '2018-07-25',
  time: '08:00:00',
  spaces: 5,
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

// const COURSE2 = {
//   id: 2,
//   course_type: {
//     id: 2,
//     name: 'CBT Training'
//   },
//   date: '2018-07-25',
//   time: '09:00:00',
//   spaces: 2,
//   orders: [],
//   supplier: 697
// }

it('Renders orders and space list', () => {
  const wrapper = mount(
    <MemoryRouter>
      <OrdersPanel course={COURSE1} />
    </MemoryRouter>
  )

  const rows = wrapper.find(CoursesPanelItem)
  expect(rows).toHaveLength(COURSE1.orders.length)
  const rows1 = wrapper.find(OrdersPanelSpaceItem)
  expect(rows1).toHaveLength(COURSE1.spaces - COURSE1.orders.length)
})
