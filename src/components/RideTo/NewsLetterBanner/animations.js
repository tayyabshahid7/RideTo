import { Power1, TimelineLite } from 'gsap'
import 'gsap/all'

const animations = {
  fadeIn: () => {
    var tl = new TimelineLite()
    tl.fromTo(
      `#news-banner-container`,
      { autoAlpha: 0, zIndex: 2 },
      { autoAlpha: 1, zIndex: 2, ease: Power1.easeOut, display: 'block' },
      0.3
    )
  },
  fadeOut: callBack => {
    var tl = new TimelineLite()
    tl.fromTo(
      `#news-banner-container`,
      { autoAlpha: 1, zIndex: 2 },
      {
        autoAlpha: 0,
        zIndex: 2,
        ease: Power1.easeOut,
        display: 'none',
        onComplete: () =>
          setTimeout(function() {
            callBack()
          }, 0)
      },
      0.4
    )
  }
}

export default animations
