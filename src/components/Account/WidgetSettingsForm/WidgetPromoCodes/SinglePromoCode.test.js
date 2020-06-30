import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SinglePromoCode from './SinglePromoCode'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  code: {
    id: 226,
    code: 'IPAZ2020',
    discount: '10.00',
    is_active: true,
    is_deleted: false,
    num_of_uses_available: 94,
    expire_date: '2020-04-29T23:00:00Z',
    school_profile: 25
  },
  updateCode: jest.fn(),
  removeCode: jest.fn(),
  submitCode: jest.fn()
}

it('Save button should be disabled by default', () => {
  const wrapper = shallow(<SinglePromoCode {...defaultProps} />)

  expect(wrapper.find('Button[type="submit"]').prop('disabled')).toEqual(true)
})

it('Changing any value should enable the submti button', () => {
  const wrapper = shallow(<SinglePromoCode {...defaultProps} />)

  wrapper.find('ConnectInput[name="code"]').simulate('change', {
    target: {
      name: 'code',
      value: 'newcode'
    }
  })

  expect(wrapper.find('Button[type="submit"]').prop('disabled')).toEqual(false)
})

it('Changing any value should call the updateCode function', () => {
  defaultProps.updateCode.mockReset()
  const wrapper = shallow(<SinglePromoCode {...defaultProps} />)

  wrapper.find('ConnectInput[name="code"]').simulate('change', {
    target: {
      name: 'code',
      value: 'newcode'
    }
  })

  expect(defaultProps.updateCode).toHaveBeenCalledTimes(1)
})

it('Submit form should call the submitCode function', () => {
  defaultProps.submitCode.mockReset()
  const wrapper = shallow(<SinglePromoCode {...defaultProps} />)

  wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
  expect(defaultProps.submitCode).toHaveBeenCalledTimes(1)
})

it('Remove button should call the removeCode function', () => {
  defaultProps.removeCode.mockReset()
  const wrapper = shallow(<SinglePromoCode {...defaultProps} />)

  wrapper.find('Button[type="button"]').simulate('click')
  expect(defaultProps.removeCode).toHaveBeenCalledTimes(1)
})
