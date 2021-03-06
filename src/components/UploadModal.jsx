import React, { Component } from 'react'
import EXIF from 'exif-js'

import { connectToMap, VectorLayer, centerAndZoom } from '@bayer/ol-kit'
import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + (minutes/60) + (seconds/3600);
  if (direction === "S" || direction === "W") {
      dd = dd * -1; 
  }
  return dd;
}

class UploadModal extends Component {

  constructor() {
    super()
    this.state = {
      open: true
    }
  }

  async handleChange(stuff, map) {
    console.log("this is the stuff", stuff.target.files[0])
    console.log("typeof", typeof stuff.target.files)

    EXIF.getData(stuff.target.files[0], function() {
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
        
        const layer = new VectorLayer({
          title: 'Diltz\' House',
          source: new olSourceVector({
            features: [new olFeature({
              feature_type: ['the lake house'],
              title: 'the lake house',
              name: 'the lake house',
              ...tags,
              geometry: new olGeomPoint(olProj.fromLonLat([lonFinal, latFinal]))
            })]
          })
        })
        map.addLayer(layer)
        centerAndZoom(map, { y: latFinal, x: lonFinal, zoom: 17.16 })

      } else {

        navigator.geolocation.getCurrentPosition((position) => {
          console.log("position", position)
          const layer = new VectorLayer({
            title: 'Diltz\' House',
            source: new olSourceVector({
              features: [new olFeature({
                feature_type: ['the lake house'],
                title: 'the lake house',
                name: 'the lake house',
                ...tags,
                geometry: new olGeomPoint(olProj.fromLonLat([position.coords.longitude, position.coords.latitude]))
              })]
            })
          })
          map.addLayer(layer)
          centerAndZoom(map, { y: position.coords.latitude, x: position.coords.longitude, zoom: 17.16 })
        })
      }
    })

    this.props.handleModalClose()
  }

  render() {
    return (
      <>
        <Dialog
          open={this.props.open}
        >
          <DialogTitle>Upload Pothole Image</DialogTitle>
          <DialogContent>
            <Typography>Upload your file!</Typography> 
            <Input type='file' inputProps={{ accept: 'image/*' }} onChange={(e) => {
              this.handleChange(e, this.props.map)
              this.setState({ open: false })
            }} />

          </DialogContent>
        </Dialog>
      </>
    )
  }
}

export default connectToMap(UploadModal)