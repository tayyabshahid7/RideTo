import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AvailabilityCourses from './AvailabilityCourses'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
    defaultDays: {
      days: 'TFTTTTT',
      loading: false,
      saving: false,
      error: null
    },
    user: {
      email: 'ipasscbt@gmail.com',
      first_name: 'IPass CBT',
      last_name: '',
      name: 'IPass CBT',
      suppliers: [
        {
          id: 44,
          name: 'IPASS CBT Osterley',
          town: 'Osterley'
        }
      ],
      permission_level: 'USER_ADMIN'
    },
    updateDefaultDays: jest.fn()
  }
  wrapper = shallow(<AvailabilityCourses {...props} />)
})

it('Shows bulk form after button is clicked', () => {
  expect(wrapper.find('CreateBulkCourse').exists()).toEqual(false)

  wrapper.setState({ showCreateBulkCourseForm: true })
  expect(wrapper.find('CreateBulkCourse').exists()).toEqual(true)
})

it('Default days checked based on default props', () => {
  props.defaultDays.days.split('').forEach((flag, index) => {
    const value = flag === 'T'
    expect(wrapper.find('#customCheck' + index).prop('checked')).toBe(value)
  })
})

it('Save default days button click calls function', () => {
  wrapper.find('#btnSaveDefaultDays').simulate('click')
  expect(props.updateDefaultDays).toHaveBeenCalled()
})
