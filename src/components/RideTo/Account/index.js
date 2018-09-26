import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'
import SignupPage from 'components/RideTo/Account/SignupPage'
import LandingPage from 'components/RideTo/Account/LandingPage'

const Account = () => {
  console.log('Account')
  return (
    <BrowserRouter>
      <div>
        <Route path="/account" component={LandingPage} exact />
        <Route path="/account/signup" component={SignupPage} />
      </div>
    </BrowserRouter>
  )
}

export default Account
