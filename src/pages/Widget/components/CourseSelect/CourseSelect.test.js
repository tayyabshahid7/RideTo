import React from 'react'
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
  const wrapper = mount(
    <CourseSelect courses={COURSES} onChangeCourse={jest.fn()} />
  )

  expect(
    wrapper
      .find('.courseTime')
      .at(0)
      .text()
  ).toBe(COURSES[0].time)
  expect(
    wrapper
      .find('.courseTime')
      .at(1)
      .text()
  ).toBe(COURSES[1].time)
  expect(
    wrapper
      .find('.courseTime')
      .at(2)
      .text()
  ).toBe(COURSES[2].time)
})

it('Triggers change on click', () => {
  const onClick = jest.fn()
  const wrapper = mount(
    <CourseSelect
      courses={COURSES}
      selectedCourse={{ id: 2, time: '12:00' }}
      onChangeCourse={onClick}
    />
  )

  wrapper
    .find('.courseTime')
    .at(2)
    .simulate('click')
  expect(onClick).toHaveBeenCalledWith(COURSES[2])
})
