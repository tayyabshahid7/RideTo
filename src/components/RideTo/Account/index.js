import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'
import SignupPage from 'components/RideTo/Account/SignupPage'
import LandingPage from 'components/RideTo/Account/LandingPage'
import LoginPage from 'components/RideTo/Account/LoginPage'
import DashboardPageV2 from 'components/RideTo/Account/DashboardPageV2'

const Account = () => {
  return (
    <BrowserRouter>
      <div style={{ background: '#f9f9f9', overflow: 'hidden' }}>
        <Route path="/account" component={LandingPage} exact />
        <Route path="/account/signup" component={SignupPage} />
        <Route path="/account/login" component={LoginPage} />
        <Route
          path="/account/dashboard/:orderId?"
          component={DashboardPageV2}
        />
      </div>
    </BrowserRouter>
  )
}

export default Account
