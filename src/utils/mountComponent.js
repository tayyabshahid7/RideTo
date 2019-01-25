import React from 'react'
import ReactDOM from 'react-dom'
import loadable from '@loadable/component'
import 'intersection-observer'

const AsyncComponent = loadable(props =>
  import(`components/RideTo/${props.module}`)
)

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0
}

const mountComponent = (module, el, props, lazy = true) => {
  const container = document.getElementById(el)

  if (container) {
    if (!lazy) {
      ReactDOM.render(<AsyncComponent module={module} {...props} />, container)
      return
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ReactDOM.render(
            <AsyncComponent module={module} {...props} />,
            container
          )
          observer.unobserve(entry.target)
        }
      })
    }, options)

    observer.observe(container)
  }
}

export default mountComponent
