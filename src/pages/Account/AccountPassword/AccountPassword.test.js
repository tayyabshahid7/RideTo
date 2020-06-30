import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import AccountPassword from './AccountPassword'

Enzyme.configure({ adapter: new Adapter() })

const defaultProps = {
  updatePassword: jest.fn(),
  showNotification: jest.fn()
}

it('Show password form after toggle button is clicked', () => {
  const wrapper = shallow(<AccountPassword {...defaultProps} />)

  expect(wrapper.find('form').exists()).toEqual(false)

  wrapper.find('Button#togglePasswordForm').simulate('click')
  expect(wrapper.find('form').exists()).toEqual(true)
})

it('Form submit should call the updatePassword function', () => {
  const wrapper = shallow(<AccountPassword {...defaultProps} />)

  wrapper.find('Button#togglePasswordForm').simulate('click')

  wrapper.find('ConnectInput[name="oldPassword"]').simulate('change', {
    target: {
      name: 'oldPassword',
      value: 'password'
    }
  })

  wrapper.find('ConnectInput[name="newPassword"]').simulate('change', {
    target: {
      name: 'newPassword',
      value: 'password'
    }
  })

  wrapper.find('ConnectInput[name="confirmPassword"]').simulate('change', {
    target: {
      name: 'confirmPassword',
      value: 'password'
    }
  })

  wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
  expect(defaultProps.updatePassword).toHaveBeenCalledTimes(1)
})

it('Wrong password match should not call updatePassword function', () => {
  const wrapper = shallow(<AccountPassword {...defaultProps} />)

  defaultProps.updatePassword.mockReset()
  wrapper.find('Button#togglePasswordForm').simulate('click')

  wrapper.find('ConnectInput[name="oldPassword"]').simulate('change', {
    target: {
      name: 'oldPassword',
      value: 'password'
    }
  })

  wrapper.find('ConnectInput[name="newPassword"]').simulate('change', {
    target: {
      name: 'newPassword',
      value: 'password'
    }
  })

  wrapper.find('ConnectInput[name="confirmPassword"]').simulate('change', {
    target: {
      name: 'confirmPassword',
      value: 'wrong password'
    }
  })

  wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
  expect(defaultProps.updatePassword).toHaveBeenCalledTimes(0)
})
