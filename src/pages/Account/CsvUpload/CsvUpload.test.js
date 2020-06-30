import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CsvUpload from './CsvUpload'

Enzyme.configure({ adapter: new Adapter() })

let wrapper
let props

beforeEach(() => {
  props = {}
  wrapper = shallow(<CsvUpload {...props} />)
})

it('Submit button should be hidden by default', () => {
  expect(wrapper.find('Button[type="submit"]')).toHaveLength(0)
})
