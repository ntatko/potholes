import React from 'react'
import { Map, Controls, LayerPanel, Popup, centerAndZoom } from '@bayer/ol-kit'

import Sidebar from './components/Sidebar'
import UploadModal from './components/UploadModal'

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
      <Map
        fullScreen
        onMapInit={this.onMapInit}
      >
        <Sidebar showModal={this.showModal} />
        {this.state.showModal && <UploadModal open={this.state.showModal} handleModalClose={() => this.setState({showModal: false})} />}
        <Controls />
        <LayerPanel />
        <Popup />
      </Map>
    )
  }
}

export default App
