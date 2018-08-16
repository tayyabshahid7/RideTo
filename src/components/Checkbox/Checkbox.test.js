import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Checkbox from './index'

Enzyme.configure({ adapter: new Adapter() })

it('Renders Checkbox', () => {
  const wrapper = mount(
    <Checkbox checked={true} onChange={jest.fn()}>
      Test
    </Checkbox>
  )

  expect(wrapper.find('label').text()).toBe('Test')
  expect(wrapper.find('input').prop('checked')).toBe(true)
  expect(wrapper.find('input').prop('disabled')).not.toBeDefined()

  wrapper.setProps({ checked: false })
  expect(wrapper.find('input').prop('checked')).toBe(false)

  wrapper.setProps({ disabled: true })
  expect(wrapper.find('input').prop('disabled')).toBe(true)
})

it('Triggers onChange', () => {
  const onChange = jest.fn()
  const wrapper = mount(<Checkbox checked={true} onChange={onChange} />)

  wrapper.find('input').simulate('change')
  expect(onChange).toHaveBeenCalled()
})
