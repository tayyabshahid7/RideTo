import mountComponent from 'utils/mountComponent'
import { setVersionInfo } from 'services/version'
import menuToggle from 'menuToggle'
// import 'bootstrap'
import './rideto_bootstrap.scss'
import './rideto_constants.scss'

setVersionInfo()

// JS to handle clicking of burger menu
menuToggle()

mountComponent('Account', 'rideto-account-page')

mountComponent('CourseSlider', 'rideto-home-course-slider', {
  sidepanel: true
})

mountComponent('ResultPage', 'rideto-resultspage-root', {}, false)

mountComponent('ReviewSlider', 'rideto-home-reviews')

mountComponent('CourseMenuItem', 'rideto-home-course-menu')

mountComponent('UserMenuItem', 'rideto-nav-account')

mountComponent('CourseTypeSelection', 'rideto-course-type-selection', {}, false)

mountComponent('AddonSelection', 'rideto-addon-selection', {}, false)

mountComponent('CheckoutPage', 'rideto-checkout')

mountComponent('FooterLinks', 'rideto-mobile-footer-links')

mountComponent('Faqs', 'rideto-faqs')

mountComponent('CourseTypeLanding', 'course-type-root')
