import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MobileMap from './components/MobileMap'
import Home from './components/Home'

class App extends React.Component { 
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
    }

    window.serviceBindings = {
      GEOKIT_API_URL: process.env.REACT_APP_GEOKIT_API || 'https://geokit-api.herokuapp.com'
    }
  }

  async componentDidMount() {
    await navigator?.permissions?.query({name:'geolocation'})
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route path="/mobile-map">
            <MobileMap />
          </Route>
          <Route path={["/:id", "/"]} >
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
