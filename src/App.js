import React from 'react'
import { Map, Controls, LayerPanel, Popup, centerAndZoom } from '@bayer/ol-kit'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Sidebar from './components/Sidebar'
import UploadModal from './components/UploadModal'
import MobileHome from './components/MobileHome';
import MobileMap from './components/MobileMap'
import Home from './components/Home'

class App extends React.Component { 
  constructor (props) {
    super(props)

    this.state = {
      showModal: false
    }
  }

  async componentDidMount() {
    await navigator.permissions.query({name:'geolocation'})

    window.serviceBindings = {
      GEOKIT_API_URL: process.env.REACT_APP_GEOKIT_API || 'http://geokit-api.herokuapp.com'
    }
  }

  onMapInit = async map => {
    const opts = {
      x: -89.938355,
      y: 38.923748,
      zoom: 14,
    }
    centerAndZoom(map, opts)
  }
  showModal = () => {
    this.setState({ showModal: true })
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route path="/mobile-map">
            <MobileMap />
          </Route>
          <Route path="/map">
            <Map fullScreen onMapInit={this.onMapInit} >
              <Sidebar showModal={this.showModal} />
              {this.state.showModal && <UploadModal open={this.state.showModal} handleModalClose={() => this.setState({showModal: false})} />}
              <Controls />
              <LayerPanel />
              <Popup />
            </Map>
          </Route>
          <Route path='mobile-upload'>
            <MobileHome />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
