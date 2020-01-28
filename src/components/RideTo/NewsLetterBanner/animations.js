import styles from './NewsLetterBanner.scss'
import { Power1, TimelineLite } from 'gsap'
const animations = {
  fadeIn: () => {
    var tl = new TimelineLite()
    tl.fromTo(
      `.${styles.newsLetterBannerWrapper}`,
      { autoAlpha: 0, zIndex: 2 },
      { autoAlpha: 1, zIndex: 2, ease: Power1.easeOut, display: 'block' },
      0.3
    )
  },
  fadeOut: callBack => {
    var tl = new TimelineLite()
    tl.fromTo(
      `.${styles.newsLetterBannerWrapper}`,
      { autoAlpha: 1, zIndex: 2 },
      {
        autoAlpha: 0,
        zIndex: 2,
        ease: Power1.easeOut,
        display: 'none',
        onComplete: () =>
          setTimeout(function() {
            callBack()
          }, 500)
      },
      0.3
    )
  }
}

export default animations
