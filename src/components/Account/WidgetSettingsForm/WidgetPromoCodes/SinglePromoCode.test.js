import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SinglePromoCode from './SinglePromoCode'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {
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
  wrapper = shallow(<SinglePromoCode {...props} />)
})

it('Save button should be disabled by default', () => {
  expect(wrapper.find('Button[type="submit"]').prop('disabled')).toEqual(true)
})

it('Changing any value should enable the submti button', () => {
  wrapper.find('ConnectInput[name="code"]').simulate('change', {
    target: {
      name: 'code',
      value: 'newcode'
    }
  })

  expect(wrapper.find('Button[type="submit"]').prop('disabled')).toEqual(false)
})

it('Changing any value should call the updateCode function', () => {
  wrapper.find('ConnectInput[name="code"]').simulate('change', {
    target: {
      name: 'code',
      value: 'newcode'
    }
  })

  expect(props.updateCode).toHaveBeenCalledTimes(1)
})

it('Submit form should call the submitCode function', () => {
  wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
  expect(props.submitCode).toHaveBeenCalledTimes(1)
})

it('Remove button should call the removeCode function', () => {
  wrapper.find('Button[type="button"]').simulate('click')
  expect(props.removeCode).toHaveBeenCalledTimes(1)
})
