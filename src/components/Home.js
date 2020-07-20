import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import EXIF from 'exif-js'
import { v4 as UUID } from 'uuid'

import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'
import olStyleStyle from 'ol/style/style'
import olStyleFill from 'ol/style/fill'
import olStyleCircle from 'ol/style/circle'
import olStyleStroke from 'ol/style/stroke'

import styled from 'styled-components'
import '../App.css';
import { Map, VectorLayer, centerAndZoom, Popup } from '@bayer/ol-kit'

const container = {
  height: '100%'
}

const button = {
  backgroundColor: '#231f20',
  width: '100%',
  borderRadius: '8px',
  height: '3.3em',
  fontWeight: '700',
  boxShadow: 'rgba(0, 0, 0, 0.81) 0 10px 25px 0px'
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + (minutes/60) + (seconds/3600);
  if (direction === "S" || direction === "W") {
      dd = dd * -1; 
  }
  return dd;
}

const Header = styled.div`
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

`

const Content = styled.div`
  height: 70%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  align-items: center;
  left: ${props => props.activePage === 0 ? '0' : `-${props.width}px`};
  transition: all .3s;
  position: absolute;
`

const PillContainer = styled.div`
  width: 135px;
  background: rgb(236, 236, 236);
  border-radius: 50px;
  height: 37px;
  position: relative;

  &:hover {
    cursor: pointer;
  }
`

const pill = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderRadius: '15px',
  height: '100%'
}

const Slider = styled.div`
  height: 100%;
  width: 52%;
  background: rgb(201, 201, 201);
  position: absolute;
  border-radius: 50px;
  top: 0px;
  transition: left 0.3s ease 0s;
  left: ${props => props.activePage === 0 ? '0px' : '48%'};
`

const PillText = styled.p`
  z-index: 5;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #424242;
`

const Card = styled.div`
  width: 90%;
  height: 90px;
  min-height: 90px;
  border-radius: 15px;
  overflow: hidden;
  max-width: 600px;
  box-shadow: none;
  background: #f3f3f3;
`

const Image = styled.img`
  width: 15rem !important;
  height: 100px;
  background-image: ${props => `url(${props.src})`} ;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

const CardContent = styled.div`
  width: 100%;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`

const CardTitle = styled.p`
  float: right;
  margin: 0;
  color: #424242;
  letter-spacing: 1px;
  font-weight: 700;
`

const CardFooter = styled.p`
  float: right;
  margin: 0;
  color: ${props => props.color};
  font-size: 0.8rem;
  bottom: 0;
`

const PageTitle = styled.h5`
  margin: 30px 0px;
  font-weight: 700;
  color: #424242;
`

const MapContainer = styled.div`
  height: 70%;
  width: 100%;
  position: absolute;
  right: ${props => props.activePage === 0 ? `-${props.width}px` : '0'};
  transition: all .3s;
  top: 30%;
  bottom: unset;
  left: unset;
`

function timeSince(dateTime) {
  const date = new Date(dateTime);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

const priorityStyle = {
  high: 'red',
  medium: 'orange',
  low: 'yellow'
}

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = { activePage: 0, potholes: [], map: null, width: 400 }
  }

  async componentDidMount () {
    
    const { width } = document.getElementById('page-content').getBoundingClientRect()

    this.setState({ width })
    await this.makeMapChanges()

    setInterval(this.makeMapChanges, 60000)
  }

  makeMapChanges = async () => {
    const response = await fetch(`${window.serviceBindings.GEOKIT_API_URL}/report`)
    const allPoints = await response.json()

    const newPoints = allPoints.filter(point => !this.state.potholes.map(hole => hole.id).includes(point.id))
    if (newPoints.length) {
      const layer = this.state.map.getLayers().getArray().find(layer => layer.get('title') === 'Potholes')

      newPoints.map(point => {
        return new olFeature({
          feature_type: ['pothole'],
          title: 'pothole',
          name: 'pothole',
          id: point.id,
          ...point,
          geometry: new olGeomPoint(olProj.fromLonLat([point.location_lon, point.location_lat]))
        })
      }).forEach(point => {
        layer.getSource().addFeature(point)
      })
      this.setState({ potholes: allPoints })
    }

    const deadPoints = this.state.potholes.filter(point => !allPoints.map(hole => hole.id).includes(point.id))
    if (deadPoints.length) {
      const layer = this.state.map.getLayers().getArray().find(layer => layer.get('title') === 'Potholes')

      deadPoints.forEach(point => {
        layer.getSource().removeFeature(layer.getSource().getFeatureById(point.id))
      })

      this.setState({ potholes: allPoints })
    }
  }

  handleChange = async event => {
    const file = event.target.files[0];
    console.log("this is the event", file)
    const props = this.props

    let position
    await navigator.geolocation.getCurrentPosition((p) => {
      position = p
    }, (failure) => {
      console.log(failure)
      // this.setState({ loading: false, error: failure })
    }, {enableHighAccuracy: true})

    console.log(position)

    EXIF.getData(file, function() {
      const tags =  EXIF.getAllTags(this);
      console.log("tags", tags)

      if (tags.GPSLatitude) {

        const latDegree = tags.GPSLatitude[0].numerator/tags.GPSLatitude[0].denominator;
        const latMinute = tags.GPSLatitude[1].numerator/tags.GPSLatitude[1].denominator;
        const latSecond = tags.GPSLatitude[2].numerator/tags.GPSLatitude[2].denominator;
        const latDirection = tags.GPSLatitudeRef;
        const latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
        console.log(latFinal);
        // Calculate longitude decimal
        const lonDegree = tags.GPSLongitude[0].numerator/tags.GPSLongitude[0].denominator;
        const lonMinute = tags.GPSLongitude[1].numerator/tags.GPSLongitude[1].denominator;
        const lonSecond = tags.GPSLongitude[2].numerator/tags.GPSLongitude[2].denominator;
        const lonDirection = tags.GPSLongitudeRef;
        const lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
        console.log(lonFinal);
        
        props.history.push({
          pathname: '/mobile-map',
          state: { y: latFinal, x: lonFinal, zoom: 18, file }
        })
      } else if (position?.coords) {
        console.log("what's the url?")
        props.history.push({
          pathname: '/mobile-map',
          state: { y: position.coords.latitude, x: position.coords.longitude, zoom: 18, file }
        })
      } else {
        console.log("what's the url?")
        props.history.push({
          pathname: '/mobile-map',
          state: { y: 38.923748, x: -89.938355, zoom: 14, message: "Location data not found. Please update your position", file }
        })
      }
    })
  }
  

  onMapInit = (map) => {
    const opts = {
      x: -89.938355,
      y: 38.923748,
      zoom: 14,
    }
    centerAndZoom(map, opts)

    const layer = new VectorLayer({
      title: 'Potholes',
      style: feature => {
        if (!feature) return new olStyleStyle({
          image: new olStyleCircle({
            radius: 5,
            fill: new olStyleFill({
              color: '#000'
            }),
          })
        })


        return new olStyleStyle({
          image: new olStyleCircle({
            radius: 5,
            fill: new olStyleFill({
              color: priorityStyle[feature.get('priority')]
            }),
            stroke: new olStyleStroke({
              color: 'black',
              width: 2
            })
          })
        })
      },
      source: new olSourceVector()
    })

    map.addLayer(layer)

    this.setState({ map })

    window.map = map
  }

  render () {
    return (
      <div style={container} id='page-content'>
        <Header>
          <PageTitle style={{ margin: '30px 0px' }}>Road Improvements</PageTitle>
          <PillContainer>
            <div style={pill}>
              <PillText onClick={() => this.setState({ activePage: 0 })}>LIST</PillText>
              <PillText onClick={() => this.setState({ activePage: 1 })}>MAP</PillText>
            </div>
            <Slider activePage={this.state.activePage} />
          </PillContainer>
        </Header>
        <Content  activePage={this.state.activePage} width={this.state.width}>
          
          { this.state.potholes.map((pothole) => (
            <Card className="card horizontal" key={pothole.id}>
              <div className="card-image">
                <Image src={pothole.image_url} />
              </div>
              <CardContent>
                <CardTitle>Pothole</CardTitle>
                <CardFooter color='gray'>{pothole.address}</CardFooter>
                <CardFooter color='lightgray'>Added {timeSince(pothole.createddate)} ago</CardFooter>
              </CardContent>
            </Card>
          ))}
          
        </Content>
        <MapContainer activePage={this.state.activePage} width={this.state.width}>
          <Map onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false}>
          </Map>
        </MapContainer>

        <a
          style={{ position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#424242' }}
          onClick={() => document.getElementById('file-upload').click()}
          class="btn-floating btn-large waves-effect waves-light"><i class="material-icons">add</i></a>
          <input id='file-upload' hidden='true' style={button} type='file' accept='image/*' onChange={(e) => {
            this.handleChange(e)
            this.setState({ open: false })
          }} />
      </div>
    )
  }
}

export default withRouter(Home)
