import React from 'react'
import ReactDOM from 'react-dom'

import CourseSlider from 'components/RideTo/CourseSlider'
import CourseMenuItem from 'components/RideTo/CourseMenuItem'
import CourseTypeSelection from 'components/RideTo/CourseTypeSelection'
import ReviewSlider from 'components/RideTo/ReviewSlider'
import ResultPage from 'components/RideTo/ResultPage'
import AddonSelection from 'components/RideTo/AddonSelection'
import Account from 'components/RideTo/Account'
import CheckoutPage from 'components/RideTo/CheckoutPage'

import { setVersionInfo } from 'services/version'
// import 'bootstrap'
import 'font-awesome/css/font-awesome.css'
import 'bootstrap'
import './rideto_bootstrap.scss'
import './rideto_constants.scss'
import './scss/fonts/RiftSoftMedium.scss'
import './scss/fonts/ProximaNova.scss'

setVersionInfo()

const mountComponent = (component, el) => {
  if (el) {
    ReactDOM.render(component, el)
  }
}

mountComponent(<Account />, document.getElementById('rideto-account-page'))

mountComponent(
  <CourseSlider sidepanel={true} />,
  document.getElementById('rideto-home-course-slider')
)

mountComponent(
  <ResultPage />,
  document.getElementById('rideto-resultspage-root')
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

mountComponent(
  <AddonSelection />,
  document.getElementById('rideto-addon-selection')
)

mountComponent(<CheckoutPage />, document.getElementById('rideto-checkout'))
