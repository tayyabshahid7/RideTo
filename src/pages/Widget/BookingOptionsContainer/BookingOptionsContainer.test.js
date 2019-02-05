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
  month: moment('2018-07-01', 'YYYY-MM-DD').startOf('month')
})

describe('Initial Render', () => {
  beforeEach(() => {
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
    expect(wrapper.find('button').text()).toBe('Book Now')
  })
})

describe('Change Date', () => {
  beforeEach(() => {
    wrapper.instance().setAvailableCourses(courses, courseType)
    wrapper.setState({})
  })

  it('Updates the selected course', () => {
    expect(wrapper.state('selectedCourse').date).toBe('2018-07-27')
    wrapper.instance().handleChangeDate(moment('2018-08-14', 'YYYY-MM-DD'))
    wrapper.setState({})
    expect(wrapper.state('selectedCourse').date).toBe('2018-08-14')

    expect(wrapper.find('button').text()).toBe('Book Now')
  })
})
