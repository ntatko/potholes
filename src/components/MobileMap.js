import React, { Component } from 'react'
import { Map, centerAndZoom } from '@bayer/ol-kit'
import { withRouter } from 'react-router-dom'
import olProj from 'ol/proj'
import axios from 'axios'
import { v4 as UUID } from 'uuid'
import styled from 'styled-components'
import { BounceLoader } from 'react-spinners'


const PaleDiv = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.4);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

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
  bottom: '10%',
  maxWidth: '300px'
}

const icon = {
  position: 'absolute',
  fontSize: '56px',
  paddingBottom: '46px'
}



class MobileMap extends Component {
  constructor() {
    super()
    this.state = {loading: false}
  }
  handleClick = async () => {
    this.setState({loading: true})

    const [long, lat] = olProj.transform(this.state.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')
    const key = "82OD8xUAEGtjlGG8QmixjVe90rErA3NU"

    const response = await fetch(`https://open.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${lat},${long}&includeStreet=true`)
    const address = await response.json()

    const file = this.props.location.state.file
    console.log(file)
    // Split the filename to get the name and type
    const fileParts = file.name.split('.');
    const fileType = fileParts[1];
    let s3PhotoUrl
    console.log("Preparing the upload");
    try {
      this.setState({ loading: true })
      const response = await axios.post("https://geokit-api.herokuapp.com/getSignedUrl", {
        fileName: `${new Date().toISOString()}-${UUID()}.${fileType}`
      })
      const returnData = response.data.data.returnData;
      const signedRequest = returnData.signedRequest;

      console.log("Recieved a signed request", signedRequest)
      // Put the fileType in the headers for the upload
      var options = {
        headers: {
          'Content-Type': 'image/jpeg'
        }
      };
      // fetch(signedRequest, { method: 'PUT', mode: 'no-cors', body: JSON.stringify(file)})
      const result = await axios.put(signedRequest, file, options)
      s3PhotoUrl = result.config.url.split('?')[0]
      console.log("Response from s3", result)
      this.setState({success: true});
    } catch (err) {
      console.error(err)
    }

    const potholeData = {
      long,
      lat,
      priority: 'low',
      address: address.results[0].locations[0].street,
      imageUrl: s3PhotoUrl
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
      <>
        <Map fullScreen onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false}>
          <div style={container}>
            <i style={icon} className="medium material-icons">place</i>
            <button style={button} onClick={this.handleClick} className='waves-effect waves-light btn'>Looks Good</button>
          </div>
        </Map>
        {this.state.loading && <PaleDiv>
          <BounceLoader color={'rgba(168, 219, 91, 0.9)'} size={200} />
        </PaleDiv>}
      </>
    )
  }

}

export default withRouter(MobileMap)
