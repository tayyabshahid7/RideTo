import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'

import EventsPanelItem from './index'

Enzyme.configure({ adapter: new Adapter() })

const EVENT = {
  id: 1,
  name: 'Event 1',
  start_time: '2018-01-01T10:00:00',
  end_time: '2018-01-05T15:00:00',
  supplier: 697
}

it('Renders Event title and link', () => {
  const wrapper = mount(
    <MemoryRouter>
      <EventsPanelItem event={EVENT} date="2018-01-01" />
    </MemoryRouter>
  )

  expect(wrapper.text()).toContain('Event 1')
  expect(
    wrapper
      .find('a')
      .at(0)
      .prop('href')
  ).toContain('/calendar/events/1/edit')
})
