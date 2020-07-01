import React from 'react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SchoolSelect from './index'

Enzyme.configure({ adapter: new Adapter() })

const mockStore = configureStore([])

let wrapper
let props
let store

beforeEach(() => {
  store = mockStore({
    auth: {
      user: {
        suppliers: [{ id: 1, name: 'School 1' }, { id: 2, name: 'School 2' }]
      }
    }
  })

  props = {}

  wrapper = mount(
    <Provider store={store}>
      <SchoolSelect {...props} />
    </Provider>
  )
})

it('Should render 2 school options', () => {
  expect(wrapper.find('select option')).toHaveLength(2)
})
