import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AvailabilityCourses from './AvailabilityCourses'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  defaultDays: { days: 'TFTTTTT', loading: false, saving: false, error: null },
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

it('Shows bulk form after button is clicked', () => {
  const wrapper = shallow(<AvailabilityCourses {...defaultProps} />)

  expect(wrapper.find('CreateBulkCourse').exists()).toEqual(false)

  wrapper.setState({ showCreateBulkCourseForm: true })
  expect(wrapper.find('CreateBulkCourse').exists()).toEqual(true)
})

it('Default days checked off on Tuesday', () => {
  const wrapper = shallow(<AvailabilityCourses {...defaultProps} />)

  expect(wrapper.find('#customCheck0').prop('checked')).toBe(true)
  expect(wrapper.find('#customCheck1').prop('checked')).toBe(false)
})

it('Save default days button click calls function', () => {
  const wrapper = shallow(<AvailabilityCourses {...defaultProps} />)

  wrapper.find('#btnSaveDefaultDays').simulate('click')
  expect(defaultProps.updateDefaultDays).toHaveBeenCalled()
})
