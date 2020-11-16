import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import CourseTime from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Renders time', () => {
  const wrapper = mount(<CourseTime time="12:00:30" />)

  expect(wrapper.text()).toBe('12:00 pm')
})

it('Renders selected', () => {
  const wrapper = mount(
    <CourseTime time="12:00" courseId={1} selected={1} color="#FF0000" />
  )
  const styles = wrapper
    .find('div')
    .first()
    .prop('style')

  expect(styles.backgroundColor).toBe('#FF0000')
})
