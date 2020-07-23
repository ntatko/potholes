import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import EXIF from 'exif-js'

import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'
import olStyleStyle from 'ol/style/style'
import olStyleFill from 'ol/style/fill'
import olStyleCircle from 'ol/style/circle'
import olStyleStroke from 'ol/style/stroke'

import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion'
import '../App.css';
import { Map, VectorLayer, centerAndZoom } from '@bayer/ol-kit'

import { Header, Content, PillContainer, Slider,
  PillText, Card, ModalCard, ModalCloseButton,
  CardContent, CardPriority, PageTitle, CardFooter,
  CardMotionImage, ModalImageText, ModalImageButtons,
  MapContainer, CardBack
} from './styled'

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

const pill = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderRadius: '15px',
  height: '100%'
}

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

const getFeature = (pothole) => {
  return new olFeature({
    feature_type: ['pothole'],
    title: 'pothole',
    name: 'pothole',
    id: pothole.id,
    ...pothole,
    geometry: new olGeomPoint(olProj.fromLonLat([pothole.location_lon, pothole.location_lat]))
  })
}

const getLayer = (features) => {
  return new VectorLayer({
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
      features
    })
  })
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.scrollRef = React.createRef()
    this.state = { activePage: 0, potholes: [], map: null, width: 400, selectedPothole: null, dragging: false, sortBy: 'createddate', opacity: 0.0 }
  }

  async componentDidMount () {
    const { match } = this.props
    const { width } = document.getElementById('page-content').getBoundingClientRect()

    this.setState({ width })
    await this.getPotholes().then(() => {
      const found = this.state.potholes.find(pothole => pothole.id === Number(match.params.id))
      if (found) {
        this.setState({ selectedPothole: found })
      }
    })

    setInterval(this.getPotholes, 60000)
  }

  sortPotholes = (a, b) => {
    const { sortBy } = this.state
    if (a[sortBy] < b[sortBy]) {
      return 1
    } else if (a[sortBy] > b[sortBy]) {
      return -1
    } else {
      return 0
    }
  } 

  getPotholes = async () => {
    const response = await fetch(`${window.serviceBindings.GEOKIT_API_URL}/report`)
    const points = await response.json()

    points.sort(this.sortPotholes)
    const allPoints = points.filter(pothole => !pothole.archived)

    const newPoints = allPoints.filter(point => !this.state.potholes.map(hole => hole.id).includes(point.id))
    if (newPoints.length) {
      const layer = this.state.map.getLayers().getArray().find(layer => layer.get('title') === 'Potholes')

      newPoints.map(getFeature).forEach(point => {
        layer.getSource().addFeature(point)
      })
      this.setState({ potholes: allPoints })
    }

    const deadPoints = this.state.potholes.filter(point => !allPoints.map(hole => hole.id).includes(point.id))
    if (deadPoints.length) {
      const layer = this.state.map.getLayers().getArray().find(layer => layer.get('title') === 'Potholes')

      deadPoints.forEach(point => {
        layer.getSource().removeFeature(layer.getSource().getFeatures().find(feature => feature.get('id') === point.id))
      })

      this.setState({ potholes: allPoints })
    }
  }

  handleImageUpload = async event => {
    const file = event.target.files[0];
    const props = this.props

    let position
    await navigator.geolocation.getCurrentPosition((p) => {
      position = p
    }, (failure) => {
      console.error("Can't get device location:", failure)
    }, {enableHighAccuracy: true})

    EXIF.getData(file, function() {
      const tags =  EXIF.getAllTags(this);

      if (tags.GPSLatitude) {

        const latCoords = [...tags.GPSLatitude.map(({numerator, denominator}) => numerator/denominator), tags.GPSLatitudeRef]
        const latFinal = ConvertDMSToDD(...latCoords);
        const lonCoords = [...tags.GPSLongitude.map(({numerator, denominator}) => numerator/denominator), tags.GPSLongitudeRef]
        const lonFinal = ConvertDMSToDD(...lonCoords);
        
        props.history.push({
          pathname: '/mobile-map',
          state: { y: latFinal, x: lonFinal, zoom: 18, file }
        })
      } else if (position?.coords) {
        props.history.push({
          pathname: '/mobile-map',
          state: { y: position.coords.latitude, x: position.coords.longitude, zoom: 18, file }
        })
      } else {
        props.history.push({
          pathname: '/mobile-map',
          state: { y: 38.923748, x: -89.938355, zoom: 14, message: "Location data not found. Please update your position", file }
        })
      }
    })
  }
  
  loadMinimap = (map) => {
    const { selectedPothole } = this.state
    const opts = {
      x: selectedPothole.location_lon,
      y: selectedPothole.location_lat,
      zoom: 18
    }
    centerAndZoom(map, opts)

    const layer = getLayer([ getFeature(selectedPothole) ])

    map.addLayer(layer)
  }

  onMapInit = (map) => {
    const opts = {
      x: -89.938355,
      y: 38.923748,
      zoom: 14,
    }
    centerAndZoom(map, opts)

    const layer = getLayer([])

    map.addLayer(layer)
    this.setState({ map })
    window.map = map
  }

  handleCardDragChange = async (_, info, pothole) => {

    const url = `${window.serviceBindings.GEOKIT_API_URL}/report/${pothole.id}`
    if (info.offset.y < 300 && info.offset.y > -300) {
      if (info.offset.x < -250) {
        console.log('deleting pothole')
        try{
          await fetch(url, {method: "DELETE"})
        } catch (err) {
          console.error(err)
        }
      } else if (info.offset.x > 250) {
        console.log("archiving pothole")
        try{
          await fetch(url, {
            method: "PATCH",
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              archived: true
            })
          })
        } catch (err) {
          console.error(err)
        }
      } else {
        return
      }
      const response = await fetch(`${window.serviceBindings.GEOKIT_API_URL}/report`)
      const allPotholes = await response.json()

      allPotholes.sort(this.sortPotholes)
      this.setState({ potholes: allPotholes.filter(pothole => !pothole.archived) })
    }
  }

  handleDragSroll = (_, info) => {
    this.scrollRef.current.scrollTo(0, this.state.scrollPosition - info.offset.y)
    this.setState({ opacity: Math.abs(info.offset.x/250) })
  }

  setPriority = async string => {
    const { selectedPothole } = this.state

    const url = `${window.serviceBindings.GEOKIT_API_URL}/report/${selectedPothole.id}`

    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          priority: string
        })
      })

      const response = await fetch(url)
      const updatedFeature = await response.json()
      this.setState({selectedPothole: updatedFeature})

      const feature = this.state.map.getLayers().getArray().find(layer => layer.get('title') === "Potholes").getSource().getFeatures().find(feat => feat.get('id') === updatedFeature.id)
      
      feature.setStyle(new olStyleStyle({
        image: new olStyleCircle({
          radius: 5,
          fill: new olStyleFill({
            color: priorityStyle[updatedFeature.priority]
          }),
          stroke: new olStyleStroke({
            color: 'black',
            width: 2
          })
        })
      }))

      feature.set('priority', string)

      const nextResponse = await fetch(`${window.serviceBindings.GEOKIT_API_URL}/report`)
      const newPotholes = await nextResponse.json()

      newPotholes.sort(this.sortPotholes)
      this.setState({potholes: newPotholes.filter(pothole => !pothole.archived)})

    } catch (err) {
      console.error(err)
    }
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
        <Content ref={this.scrollRef} activePage={this.state.activePage} width={this.state.width}>
          <AnimateSharedLayout type="crossfade">
            {this.state.potholes.map(pothole => (
              <CardBack>
                <i style={{color: 'red', position: 'absolute', right: '50px', top: '40%', fontSize: '5em', opacity: this.state.opacity}} className="material-icons">delete_forever</i>
                <i style={{color: 'green', position: 'absolute', left: '50px', top: '40%', fontSize: '5em', opacity: this.state.opacity}} className="material-icons">done_outline</i>
                <Card
                  layoutId={pothole.id}
                  dragDirectionLock
                  onClick={() => !this.state.dragging && this.setState({ selectedPothole: pothole })}
                  onDragStart={() => this.setState({ dragging: true, scrollPosition: this.scrollRef.current.scrollY || this.scrollRef.current.scrollTop })}
                  onDrag={this.handleDragSroll}
                  onDragEnd={async (event, info) => {
                    setTimeout(() => this.setState({ dragging: false }), 1)
                    await this.handleCardDragChange(event, info, pothole)
                  }}
                  className="card"
                  drag="x"
                  dragConstraints={{ left: -200, right: 200 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10}} />
                  <motion.div className="card-image">
                    <motion.img style={{ height: 'auto' }} src={pothole.image_url} />
                  </motion.div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <CardContent>
                      <CardFooter>{pothole.address}</CardFooter>
                      <CardFooter>Added {timeSince(pothole.createddate)} ago</CardFooter>
                    </CardContent>
                    {pothole.priority !== 'low' && (<CardPriority>
                      <i style={{color: priorityStyle[pothole.priority], fontSize: '2em' }} className="material-icons">error</i>
                    </CardPriority>)}
                  </div>
              </Card>
            </CardBack>
            ))}

            <AnimatePresence>
              {this.state.selectedPothole && (
                <ModalCard width={this.state.width} layoutId={selectedPothole.id} className="overlay">
                  
                  <div style={{ position: 'relative' }}>
                    <CardMotionImage src={selectedPothole.image_url} style={{ maxHeight: '70vh' }} />
                    <div style={{display: 'flex', justifyContent: 'space-between' }}>
                      <ModalImageText>
                        <CardFooter>{selectedPothole.address}</CardFooter>
                        <CardFooter>Added {timeSince(selectedPothole.createddate)} ago</CardFooter>
                      </ModalImageText>
                      <ModalImageButtons>
                        {['low', 'medium', 'high'].map(level => 
                          <a key={level} style={ selectedPothole.priority === level ? { background: priorityStyle[level] } : {background: 'transparent'}}
                            onClick={() => this.setPriority(level)}
                            className="btn-floating btn-large waves-effect waves-light">
                              <i style={selectedPothole.priority === level ? {color: 'white'} : {color: priorityStyle[level]}} className="material-icons">warning</i>
                          </a>
                        )}
                      </ModalImageButtons>
                    </div>
                  </div>
                  <div>
                    <Map onMapInit={this.loadMinimap} updateUrlFromView={false} updateViewFromUrl={false} />
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
          <Map onMapInit={this.onMapInit} updateUrlFromView={false} updateViewFromUrl={false} />
        </MapContainer>

        <a style={{ position: 'absolute', bottom: '20px', right: '20px', backgroundColor: '#424242' }}
          onClick={() => document.getElementById('file-upload').click()}
          className="btn-floating btn-large waves-effect waves-light">
            <i className="material-icons add">add</i>
        </a>
        <input id='file-upload' hidden='true' style={button} type='file' accept='image/*' onChange={(e) => {
          this.handleImageUpload(e)
          this.setState({ open: false })
        }} />
      </div>
    )
  }
}

export default withRouter(Home)
