import { Desktop, Mobile } from 'common/breakpoints'
import React from 'react'

function FullLicenceBanner({ className, href }) {
  return (
    <React.Fragment>
      <Mobile>
        <a href={href}>
          <img
            src="https://rideto-production.imgix.net/static/images/Full%20licence_Pay%20Monthly_600x300px.jpg?q=80&auto=format,compress,true"
            className={className}
            alt="Full licence fast-track package"
          />
        </a>
      </Mobile>
      <Desktop>
        <a href={href}>
          <img
            src="https://rideto-production.imgix.net/static/images/Full%20licence_Pay%20Monthly_1036x312px.jpg?q=80&auto=format,compress,true"
            className={className}
            alt="Full licence fast-track package"
          />
        </a>
      </Desktop>
    </React.Fragment>
  )
}

export default FullLicenceBanner
