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

class App extends React.Component { 
  constructor (props) {
    super(props)

    this.state = {
      showModal: false
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
          <Route path="/mobile">
            <MobileHome />
          </Route>
          <Route path="/mobile-map">
            <MobileMap />
          </Route>
          <Route path="/">
            <Map fullScreen onMapInit={this.onMapInit} >
              <Sidebar showModal={this.showModal} />
              {this.state.showModal && <UploadModal open={this.state.showModal} handleModalClose={() => this.setState({showModal: false})} />}
              <Controls />
              <LayerPanel />
              <Popup />
            </Map>
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App
