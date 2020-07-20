import React, { Component } from 'react'
import { Map, centerAndZoom } from '@bayer/ol-kit'
import { withRouter } from 'react-router-dom'
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
  handleClick = async () => {

    const [long, lat] = olProj.transform(this.state.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
    const key = "82OD8xUAEGtjlGG8QmixjVe90rErA3NU"

    const response = await fetch(`https://open.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${long}&includeStreet=true`)
    const address = await response.json()

    const potholeData = {
      long,
      lat,
      priority: 'low',
      address: address.results[0].locations[0].street,
      imageUrl: this.props.location.state.url
    }

    const url = window.serviceBindings.GEOKIT_API_URL + '/report/'

    await fetch(url, {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(potholeData)
    })

    this.props.history.push('/')
  }

  onMapInit = map => {
    console.log(this.props, this.props.location.state);
    if (this.props.location.state) centerAndZoom(map, this.props.location.state)

    this.setState({ map })
  }

  render () {
    return (
      <Map fullScreen onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false}>
        <div style={container}>
          <i style={icon} className="medium material-icons">place</i>
          <button style={button} onClick={this.handleClick} className='waves-effect waves-light btn'>Looks Good</button>
        </div>
      </Map>
    )
  }

}

export default withRouter(MobileMap)
