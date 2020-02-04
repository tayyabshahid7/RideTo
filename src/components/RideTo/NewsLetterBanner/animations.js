import { Power1, TimelineLite } from 'gsap'

const animations = {
  fadeIn: newsletterWrapperClass => {
    var tl = new TimelineLite()
    tl.fromTo(
      `.${newsletterWrapperClass}`,
      { autoAlpha: 0, zIndex: 2 },
      { autoAlpha: 1, zIndex: 2, ease: Power1.easeOut, display: 'block' },
      0.3
    )
  },
  fadeOut: (callBack, newsletterWrapperClass) => {
    var tl = new TimelineLite()
    tl.fromTo(
      `.${newsletterWrapperClass}`,
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
