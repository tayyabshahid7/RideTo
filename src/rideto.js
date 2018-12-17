import lazyMountComponent from 'utils/lazyMountComponent'
import { setVersionInfo } from 'services/version'
import menuToggle from 'menuToggle'
import 'bootstrap'
import './rideto_bootstrap.scss'
import './rideto_constants.scss'

setVersionInfo()

// JS to handle clicking of burger menu
menuToggle()

lazyMountComponent('Account', 'rideto-account-page')

lazyMountComponent('CourseSlider', 'rideto-home-course-slider', {
  sidepanel: true
})

lazyMountComponent('ResultPage', 'rideto-resultspage-root')

lazyMountComponent('ReviewSlider', 'rideto-home-reviews')

lazyMountComponent('CourseMenuItem', 'rideto-home-course-menu')

lazyMountComponent('UserMenuItem', 'rideto-nav-account')

lazyMountComponent('CourseTypeSelection', 'rideto-course-type-selection')

lazyMountComponent('AddonSelection', 'rideto-addon-selection')

lazyMountComponent('CheckoutPage', 'rideto-checkout')

lazyMountComponent('FooterLinks', 'rideto-mobile-footer-links')

lazyMountComponent('Faqs', 'rideto-faqs')
