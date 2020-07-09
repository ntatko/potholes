import React from 'react'
import { Map, Controls, LayerPanel, Popup, centerAndZoom } from '@bayer/ol-kit'

class App extends React.Component {
  onMapInit = async map => {
    const opts = {
      x: -89.938355,
      y: 38.923748,
      zoom: 14,
    }
    centerAndZoom(map, opts)
  }

  render () {
    return (
      <Map
        fullScreen
        onMapInit={this.onMapInit}
        updateUrlFromView={false}
        updateViewFromUrl={false}>
        <Controls />
        <LayerPanel />
        <Popup />
      </Map>
    )
  }
}

export default App
