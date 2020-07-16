import React, { Component } from 'react'
import { Map, VectorLayer, centerAndZoom } from '@bayer/ol-kit'
import { withRouter } from 'react-router-dom'

import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%'
}

const button = {
  backgroundColor: '#231f20',
  width: '75%',
  borderRadius: '8px',
  height: '3.3em',
  fontWeight: '700',
  boxShadow: 'rgba(0, 0, 0, 0.81) 0 10px 25px 0px',
  position: 'absolute',
  bottom: '10%'
}

const icon = {
  position: 'absolute',
  fontSize: '56px',
  paddingBottom: '46px'
}



class MobileMap extends Component {
  handleClick = () => {
    console.log(this.props)

    const layer = new VectorLayer({
      title: 'Diltz\' House',
      source: new olSourceVector({
        features: [new olFeature({
          geometry: new olGeomPoint(this.state.map.getView().getCenter())
        })]
      })
    })

    this.state.map.addLayer(layer)

    this.props.history.push('/mobile')
  }

  onMapInit = map => {
    console.log(this.props, this.props.location.state);
    if (this.props.location.state) centerAndZoom(map, this.props.location.state)

    this.setState({ map })
  }

  render () {
    return (
      <Map fullScreen onMapInit={this.onMapInit}>
        <div style={container}>
          <i style={icon} className="medium material-icons">place</i>
          <button style={button} onClick={this.handleClick} className='waves-effect waves-light btn'>Looks Good</button>
        </div>
      </Map>
    )
  }

}

export default withRouter(MobileMap)
