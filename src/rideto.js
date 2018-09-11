import React from 'react'
import ReactDOM from 'react-dom'

import CourseSlider from 'components/RideTo/CourseSlider'

import { setVersionInfo } from 'services/version'

setVersionInfo()

ReactDOM.render(<h1>RideTo.COM</h1>, document.getElementById('rideto-root'))

ReactDOM.render(
  <CourseSlider />,
  document.getElementById('rideto-home-course-slider')
)
