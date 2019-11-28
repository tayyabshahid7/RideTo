import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import DefaultBikes from './DefaultBikes'

Enzyme.configure({ adapter: new Adapter() })

describe('Default bikes', () => {
  it('renders without crashing', () => {
    shallow(<DefaultBikes />)
  })

  it('contains a table', () => {
    const wrapper = mount(<DefaultBikes />)

    expect(wrapper.find('table')).toHaveLength(1)
  })
})
