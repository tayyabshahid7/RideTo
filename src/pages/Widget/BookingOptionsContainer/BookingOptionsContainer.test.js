import React from 'react'
import moment from 'moment'
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
global.sessionStorage = {
  removeItem: jest.fn()
}
global.window.document.body.scrollIntoView = jest.fn()

coursesService.fetchWidgetCourses = jest.fn(() => courses)

global.RIDE_TO_DATA = {
  widget_initial: {
    last_time_book: '09:00:00'
  }
}

const { date, time } = courses.find(
  course => course.date > moment().format('YYYY-MM-DD')
)
const widget = {}
const slug = 'test-slug'
const selectedSupplier = suppliers[0]
const courseType = {
  id: 1,
  name: 'CBT Training'
}
let wrapper = shallow(
  <BookingOptionsContainer
    widget={widget}
    slug={slug}
    suppliers={suppliers}
    selectedSupplier={selectedSupplier}
    onChangeSupplier={jest.fn()}
  />
)
wrapper.setState({
  month: moment('2019-07-01', 'YYYY-MM-DD').startOf('month')
})

describe('Initial Render', () => {
  beforeEach(() => {
    wrapper.instance().setAvailableCourses(courses, courseType)
    wrapper.setState({})
  })

  it('Sets earliest date', () => {
    expect(moment(wrapper.state('selectedDate')).format('YYYY-MM-DD')).toBe(
      date
    )
  })

  it('Selects first course', () => {
    expect(wrapper.state('selectedCourse').date).toBe(date)
    expect(wrapper.state('selectedCourse').time).toBe(time)
  })

  it('Renders course details', () => {
    expect(wrapper.find('CourseSelect').length).toBe(1)
  })

  it('Renders Booking link', () => {
    expect(wrapper.find('button').text()).toBe('Book Now')
  })
})

describe('Change Date', () => {
  beforeEach(() => {
    wrapper.instance().setAvailableCourses(courses, courseType)
    wrapper.setState({})
  })

  it('Updates the selected course', () => {
    expect(wrapper.state('selectedCourse').date).toBe(date)
    wrapper.instance().handleChangeDate(moment(date, 'YYYY-MM-DD'))
    wrapper.setState({})
    expect(wrapper.state('selectedCourse').date).toBe(date)

    expect(wrapper.find('button').text()).toBe('Book Now')
  })
})
