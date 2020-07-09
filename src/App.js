import React from 'react'
import { Map, Controls, LayerPanel, Popup, loadDataLayer } from '@bayer/ol-kit'

class App extends React.Component {
  onMapInit = async map => {
  }

  render () {
    return (
      <Map fullScreen >
        <Controls />
        <LayerPanel />
        <Popup />
      </Map>
    )
  }
}

export default App