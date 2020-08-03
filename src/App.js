import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { Auth0Provider } from "@auth0/auth0-react"

import MobileMap from './components/MobileMap'
import Home from './components/Home'

class App extends React.Component { 
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
    }

    console.log("environment", process.env.REACT_APP_ENVIRONMENT)

    window.serviceBindings = {}

    switch (process.env.REACT_APP_ENVIRONMENT) {
      case 'local':
        Object.assign(window.serviceBindings, {
          GEOKIT_API_URL: 'http://localhost:5000',
          S3_UPLOAD_API_URL: 'https://api-np.reportd.co',
          AUTH_CALLBACK_URL: 'http://localhost:3000'
        })
        break
      case 'non-prod':
        Object.assign(window.serviceBindings, {
          GEOKIT_API_URL: 'https://api-np.reportd.co',
          S3_UPLOAD_API_URL: 'https://api-np.reportd.co',
          AUTH_CALLBACK_URL: 'https://app-np.reportd.co'
        })
        break
      default:
        Object.assign(window.serviceBindings, {
          GEOKIT_API_URL: 'https://api.reportd.co',
          S3_UPLOAD_API_URL: 'https://api.reportd.co',
          AUTH_CALLBACK_URL: 'https://app.reportd.co'
        })
    }
  }

  async componentDidMount() {
    await navigator?.permissions?.query({name:'geolocation'})
  }

  render () {
    return (
      <Router>
        <Auth0Provider
          domain="reportd.us.auth0.com"
          clientId="AD9aJsewTRqW8tkRpY6VR3cG5cyJ0rp8"
          redirectUri={window.location.origin}
        >
          <Switch>
            <Route path="/mobile-map">
              <MobileMap />
            </Route>
            <Route path={["/:id", "/"]} >
              <Home />
            </Route>
          </Switch>
        </Auth0Provider>
      </Router>
    )
  }
}

export default App
