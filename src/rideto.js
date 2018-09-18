import React from 'react'
import ReactDOM from 'react-dom'

import CourseSlider from 'components/RideTo/CourseSlider'
import CourseMenuItem from 'components/RideTo/CourseMenuItem'
import CourseTypeSelection from 'components/RideTo/CourseTypeSelection'
import ReviewSlider from 'components/RideTo/ReviewSlider'

import { setVersionInfo } from 'services/version'
import 'bootstrap'
import './bootstrap.scss'
import './constants.scss'
import './scss/fonts/RiftSoftMedium.scss'
import './scss/fonts/ProximaNova.scss'

setVersionInfo()

const mountComponent = (component, el) => {
  if (el) {
    ReactDOM.render(component, el)
  }
}

mountComponent(
  <CourseSlider />,
  document.getElementById('rideto-home-course-slider')
)

mountComponent(<ReviewSlider />, document.getElementById('rideto-home-reviews'))

mountComponent(
  <CourseMenuItem />,
  document.getElementById('rideto-home-course-menu')
)

mountComponent(
  <CourseTypeSelection />,
  document.getElementById('rideto-course-type-selection')
)
