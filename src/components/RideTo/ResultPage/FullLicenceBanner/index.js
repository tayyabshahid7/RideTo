import React from 'react'
import { Desktop, Mobile } from 'common/breakpoints'

function FullLicenceBanner({ className, href }) {
  return (
    <React.Fragment>
      <Mobile>
        <a href={href}>
          <img
            src="https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/Full%20licence_Pay%20Monthly_600x300px.jpg"
            className={className}
            alt="Full licence fast-track package"
          />
        </a>
      </Mobile>
      <Desktop>
        <a href={href}>
          <img
            src="https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/Full%20licence_Pay%20Monthly_1036x312px.jpg"
            className={className}
            alt="Full licence fast-track package"
          />
        </a>
      </Desktop>
    </React.Fragment>
  )
}

export default FullLicenceBanner
