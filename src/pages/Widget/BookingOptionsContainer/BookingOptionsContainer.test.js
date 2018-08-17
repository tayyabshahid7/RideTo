import React from 'react'
import moment from 'moment'
import { MemoryRouter } from 'react-router-dom'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as coursesService from 'services/course'
import BookingOptionsContainer from './index'

import suppliers from 'json/suppliers.json'
import courses from 'json/widget-courses.json'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('pages/Widget/components/Calendar', () => () => <div />)

global.localStorage = {
  getItem: jest.fn()
}
global.window.document.body.scrollIntoView = jest.fn()

coursesService.fetchWidgetCourses = jest.fn(() => courses)

const widget = {}
const slug = 'test-slug'
const selectedSupplier = suppliers[0]
const courseType = {
  id: 1,
  name: 'CBT Training'
}

describe('Initial Render', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallow(
      <BookingOptionsContainer
        widget={widget}
        slug={slug}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        onChangeSupplier={jest.fn()}
      />
    )
    wrapper.setState({
      month: moment('2018-07-01', 'YYYY-MM-DD').startOf('month')
    })
    wrapper.instance().setAvailableCourses(courses, courseType)
    wrapper.setState({})
  })

  it('Sets earliest date', () => {
    expect(moment(wrapper.state('selectedDate')).format('YYYY-MM-DD')).toBe(
      '2018-07-27'
    )
  })

  it('Selects first course', () => {
    expect(wrapper.state('selectedCourse').date).toBe('2018-07-27')
    expect(wrapper.state('selectedCourse').time).toBe('06:00:00')
  })

  it('Renders course details', () => {
    expect(wrapper.find('CourseSelect').length).toBe(1)
  })

  it('Renders Booking link', () => {
    const expected = `/widget/${slug}/payment/${courses[0].id}?hire=no`

    expect(wrapper.find('Link').prop('to')).toBe(expected)
  })
})
