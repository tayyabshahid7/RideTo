import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import DetailContainer from './index'

import { Provider } from 'react-redux'
import configureStore from '../../../store'

Enzyme.configure({ adapter: new Adapter() })

describe('DetailContainer', () => {
  it('renders', () => {
    const store = configureStore()

    const wrapper = shallow(
      <Provider store={store}>
        <DetailContainer />
      </Provider>
    )
    expect(wrapper.exists()).toBe(true)
  })
})
