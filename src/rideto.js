import React from 'react'
import ReactDOM from 'react-dom'

import loadable from '@loadable/component'

import { setVersionInfo } from 'services/version'
// import 'bootstrap'
import 'font-awesome/css/font-awesome.css'
import 'bootstrap'
import './rideto_bootstrap.scss'
import './rideto_constants.scss'
// import './scss/fonts/RiftSoftMedium.scss'
// import './scss/fonts/ProximaNova.scss'

setVersionInfo()

const AsyncComponent = loadable(props =>
  import(`components/RideTo/${props.module}`)
)

const mountComponent = (module, el, props) => {
  const container = document.getElementById(el)

  if (container) {
    ReactDOM.render(<AsyncComponent module={module} {...props} />, container)
  }
}

mountComponent('Account', 'rideto-account-page')

mountComponent('CourseSlider', 'rideto-home-course-slider', { sidepanel: true })

mountComponent('ResultPage', 'rideto-resultspage-root')

mountComponent('ReviewSlider', 'rideto-home-reviews')

mountComponent('CourseMenuItem', 'rideto-home-course-menu')

mountComponent('UserMenuItem', 'rideto-nav-account')

mountComponent('CourseTypeSelection', 'rideto-course-type-selection')

mountComponent('AddonSelection', 'rideto-addon-selection')

mountComponent('CheckoutPage', 'rideto-checkout')

mountComponent('FooterLinks', 'rideto-mobile-footer-links')

mountComponent('Faqs', 'rideto-faqs')
