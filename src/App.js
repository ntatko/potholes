import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MobileHome from './components/MobileHome';
import MobileMap from './components/MobileMap'
import Home from './components/Home'

class App extends React.Component { 
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
      potholes: []
    }

    window.serviceBindings = {
      GEOKIT_API_URL: process.env.REACT_APP_GEOKIT_API || 'https://geokit-api.herokuapp.com'
    }
  }

  async componentDidMount() {
    const url = `${window.serviceBindings.GEOKIT_API_URL}/report/`
    await navigator?.permissions?.query({name:'geolocation'})
    
    setTimeout(async () => {
      await fetch(url).then(r => r.json()).then(data => {
        this.setState({ potholes: data })
  
        this.forceUpdate()
      })
    }, 500)

  }

  render () {
    return (
      <Router>
        <Switch>
          <Route path="/mobile-map">
            <MobileMap />
          </Route>
          <Route path="/">
            <Home potholes={this.state.potholes} />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
