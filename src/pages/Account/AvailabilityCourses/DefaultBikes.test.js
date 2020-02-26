import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import DefaultBikes from './DefaultBikes'

Enzyme.configure({ adapter: new Adapter() })

const info = {
  courseTypes: [
    {
      id: 1,
      constant: 'LICENCE_CBT',
      name: 'CBT Training',
      slug: 'cbt-training'
    },
    {
      id: 3,
      constant: 'INTRO_TO_MOTORCYCLING',
      name: 'Introduction To Motorcycling',
      slug: 'introduction-to-motorcycling'
    },
    {
      id: 4,
      constant: 'FULL_LICENCE',
      name: 'Full Licence Training',
      slug: 'motorcycle-licence'
    }
  ]
}
const user = {
  suppliers: [{ id: 1, name: 'test', town: 'testtown' }]
}

describe('Default bikes', () => {
  it('renders without crashing', () => {
    shallow(<DefaultBikes info={info} user={user} />)
  })
})
