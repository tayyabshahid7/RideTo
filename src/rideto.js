import React from 'react'
import ReactDOM from 'react-dom'

import CourseSlider from 'components/RideTo/CourseSlider'

import { setVersionInfo } from 'services/version'

setVersionInfo()

ReactDOM.render(
  <CourseSlider />,
  document.getElementById('rideto-home-course-slider')
)
