import React from 'react'
import ReactDOM from 'react-dom'

import CourseSlider from 'components/RideTo/CourseSlider'
import CourseMenuItem from 'components/RideTo/CourseMenuItem'

import { setVersionInfo } from 'services/version'

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

mountComponent(
  <CourseMenuItem />,
  document.getElementById('rideto-home-course-menu')
)
