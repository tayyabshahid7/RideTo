import React from 'react'
import moment from 'moment'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CourseSelect from './index'

Enzyme.configure({ adapter: new Adapter() })

const COURSES = [
  { id: 1, time: '09:00' },
  { id: 2, time: '12:00' },
  { id: 3, time: '15:00' }
]

it('Renders Times', () => {
  const date = moment()
  const wrapper = mount(
    <CourseSelect date={date} courses={COURSES} onChangeCourse={jest.fn()} />
  )

  expect(
    wrapper
      .find('.courseTime')
      .at(0)
      .text()
  ).toBe('9:00 am')
  expect(
    wrapper
      .find('.courseTime')
      .at(1)
      .text()
  ).toBe('12:00 pm')
  expect(
    wrapper
      .find('.courseTime')
      .at(2)
      .text()
  ).toBe('3:00 pm')
})

it('Triggers change on click', () => {
  const onClick = jest.fn()
  const date = moment()
  const wrapper = mount(
    <CourseSelect
      date={date}
      courses={COURSES}
      selectedCourse={{ id: 2, time: '12:00:00' }}
      onChangeCourse={onClick}
    />
  )

  wrapper
    .find('.courseTime')
    .at(2)
    .simulate('click')
  expect(onClick).toHaveBeenCalledWith(COURSES[2])
})
