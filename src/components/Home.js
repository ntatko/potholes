import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import potholeone from '../potholeone.png'
import pothole2 from '../pothole2.png'
import pothole3 from '../pothole3.png'

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

import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'

import colormap from 'colormap'
import axios from 'axios'

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

const Card = styled(motion.div)`
  width: 90%;
  min-height: 200px;
  border-radius: 15px;
  overflow: hidden;
  max-width: 600px;
  box-shadow: none;
  background: #f3f3f3;
  cursor: pointer;

  &:hover {
    background: #00000075
  }
`

const ModalCard = styled(motion.div)`
  width: ${props => `calc(${props.width}px - 5%)`};
  min-height: 90px;
  border-radius: 15px;
  overflow: hidden;
  max-width: 600px;
  box-shadow: none;
  background: white;
  position: fixed;
  will-change: opacity;
  max-width: 990px;
  z-index: 10;
  box-shadow: 0px 10px 20px #222222a6;
  background: #f3f3f3;
  top: 50px;
`

const ModalCloseButton = styled.i`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.67);
  color: white;
  border-radius: 50px;
  padding: 1px;
  cursor: pointer;
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
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`

const CardMotionImage = styled(motion.img)`
  width: 100%;
  height: 50%;
`

const CardFooter = styled.p`
  float: right;
  margin: 0;
  color: white;
  bottom: 0;
  font-weight: 700;
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

const ModalImageText = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
  left: 10px;
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

    this.state = { activePage: 0, potholes: [], map: null, width: 400, selectedPothole: null }
  }

  componentDidMount () {
    const { width } = document.getElementById('page-content').getBoundingClientRect()

    this.setState({ width })
  }

  componentWillReceiveProps (nextProps) {
    const { map } = this.state

    if (this.props.potholes.length) {
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
        source: new olSourceVector({
          features: this.props.potholes.map(pothole => {
            return new olFeature({
              feature_type: ['pothole'],
              title: 'pothole',
              name: 'pothole',
              id: pothole.id,
              ...pothole,
              geometry: new olGeomPoint(olProj.fromLonLat([pothole.location_lon, pothole.location_lat])),
              
            })
          })
        })
      })

      map.addLayer(layer)
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

    let url

    // upload to AWS
    // Split the filename to get the name and type
    const fileParts = file.name.split('.');
    const fileType = fileParts[1];
    console.log("Preparing the upload");
    try {
      this.setState({ loading: true })
      const response = await axios.post("https://geokit-api.herokuapp.com/getSignedUrl", {
        fileName: `${new Date().toISOString()}-${UUID()}.${fileType}`
      })
      const returnData = response.data.data.returnData;
      const signedRequest = returnData.signedRequest;
      
      // Put the fileType in the headers for the upload
      var options = {
        headers: {
          'Content-Type': 'image/jpeg'
        }
      };
      const result = await axios.put(signedRequest, file, options)
      url = result.config.url.split('?')[0]
      console.log("Response from s3", result)
      this.setState({success: true, url});
    } catch (err) {
      console.error(err)
    }

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
          state: { y: latFinal, x: lonFinal, zoom: 18, url }
        })
      } else if (position?.coords) {
        console.log("what's the url?", url)
        props.history.push({
          pathname: '/mobile-map',
          state: { y: position.coords.latitude, x: position.coords.longitude, zoom: 18, url }
        })
      } else {
        console.log("what's the url?", url)
        props.history.push({
          pathname: '/mobile-map',
          state: { y: 38.923748, x: -89.938355, zoom: 14, url, message: "Location data not found. Please update your position" }
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

    this.setState({ map })

    window.map = map
  }

  render () {
    const { selectedPothole } = this.state

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
        <AnimateSharedLayout type="crossfade">
          {this.props.potholes.map(pothole => (
            <Card layoutId={pothole.id} onClick={() => this.setState({ selectedPothole: pothole })} className="card">
              <motion.div className="card-image">
                <motion.img style={{ height: 'auto' }} src={pothole.image_url} />
              </motion.div>
              <CardContent>
                <CardFooter>{pothole.address}</CardFooter>
                <CardFooter>Added {timeSince(pothole.createddate)} ago</CardFooter>
              </CardContent>
            </Card>
          ))}

          <AnimatePresence>
            {this.state.selectedPothole && (
              <ModalCard width={this.state.width} layoutId={selectedPothole.id} className="overlay">
                
                <div style={{ position: 'relative' }}>
                <CardMotionImage src={selectedPothole.image_url} />
                  <ModalImageText>
                    <CardFooter>{selectedPothole.address}</CardFooter>
                    <CardFooter>Added {timeSince(selectedPothole.createddate)} ago</CardFooter>
                  </ModalImageText>
                </div>
                <div>
                  <motion.h5>{this.state.selectedPothole.id}</motion.h5>
                  <motion.h2>{this.state.selectedPothole.priority}</motion.h2>
                </div>
                  <ModalCloseButton onClick={() => this.setState({ selectedPothole: null })} className="material-icons">close</ModalCloseButton>
              </ModalCard>
            )}
          </AnimatePresence>
        </AnimateSharedLayout>
        </Content>
        <MapContainer activePage={this.state.activePage} width={this.state.width}>
          <Map onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false}>
          </Map>
        </MapContainer>

        

        <a style={{ position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#424242' }}
          onClick={() => document.getElementById('file-upload').click()}
          className="btn-floating btn-large waves-effect waves-light">
            <i className="material-icons">add</i>
        </a>
          <input id='file-upload' hidden='true' style={button} type='file' accept='image/*' onChange={(e) => {
            this.handleChange(e)
            this.setState({ open: false })
          }} />
      </div>
    )
  }
}

export default withRouter(Home)
