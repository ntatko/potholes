import React, { Component } from 'react'

import potholeone from '../potholeone.png'
import pothole2 from '../pothole2.png'
import pothole3 from '../pothole3.png'

import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

import styled from 'styled-components'
import '../App.css';
import { Map, VectorLayer } from '@bayer/ol-kit'

const container = {
  height: '100%'
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

const pillContainer = {
  width: '135px',
  background: '#ececec',
  borderRadius: '50px',
  height: '30px',
  position: 'relative'
}

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

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

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

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = { activePage: 0, potholes: [] }
  }

  async componentDidMount() {
    const url = `${window.serviceBindings.GEOKIT_API_URL}/report/`
    const { width } = document.getElementById('page-content').getBoundingClientRect()

    console.log(width)

    await fetch(url).then(r => r.json()).then(data => this.setState({potholes: data, width}))
  }

  onMapInit = (map) => {
    const points = this.state.potholes.map(pothole => {
      const feature = new olFeature({
        feature_type: ['pothole'],
        title: 'pothole',
        name: 'pothole',
        id: pothole.id,
        ...pothole,
        geometry: new olGeomPoint(olProj.fromLonLat([pothole.location_lon, pothole.location_lat]))
      })
      return feature
    })
    const layer = new VectorLayer({
      title: 'Diltz\' House',
      source: new olSourceVector({
        features: points
      })
    })
    map.addLayer(layer)

    window.map = map
  }

  render () {
    console.log(this.state.potholes)
    return (
      <div style={container} id='page-content'>
        <Header>
          <PageTitle style={{ margin: '30px 0px' }}>Road Improvements</PageTitle>
          <div style={pillContainer}>
            <div style={pill}>
              <PillText onClick={() => this.setState({ activePage: 0 })}>LIST</PillText>
              <PillText onClick={() => this.setState({ activePage: 1 })}>MAP</PillText>
            </div>
            <Slider activePage={this.state.activePage} />
          </div>
        </Header>
        <Content  activePage={this.state.activePage} width={this.state.width}>
          <Card className="card horizontal">
            <div className="card-image">
              <Image src={potholeone} />
            </div>
            <CardContent>
              <CardTitle>Pothole</CardTitle>
              <CardFooter color='red'>Added 20 days ago</CardFooter>
            </CardContent>
          </Card>
          <Card className="card horizontal">
            <div className="card-image">
              <Image src={pothole2} />
            </div>
            <CardContent>
              <CardTitle>Pothole</CardTitle>
              <CardFooter color='orange'>Added 12 days ago</CardFooter>
            </CardContent>
          </Card>
          <Card className="card horizontal">
            <div className="card-image">
              <Image src={pothole3} />
            </div>
            <CardContent>
              <CardTitle>Pothole</CardTitle>
              <CardFooter color='lightgray'>Added 8 days ago</CardFooter>
            </CardContent>
          </Card>
          { this.state.potholes.map((pothole) => (
            <Card className="card horizontal">
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
          <Map onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false} fullscreen={false}>
          </Map>
        </MapContainer>
      </div>
    )
  }
}

export default Home
