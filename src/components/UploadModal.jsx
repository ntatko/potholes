import React, { Component } from 'react'
import ExifReader from 'exifreader'

import { connectToMap, VectorLayer } from '@bayer/ol-kit'
import olSourceVector from 'ol/source/vector'
import olFeature from 'ol/feature'
import olGeomPoint from 'ol/geom/point'
import olProj from 'ol/proj'

import exifr from 'exifr'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
const fs = require('fs')






function ConvertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + (minutes/60) + (seconds/3600);
  if (direction == "S" || direction == "W") {
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
    const fileReader = new FileReader()

    // const buffer = fileReader.readAsArrayBuffer(stuff.target.files[0])

    // const blob = new Blob([stuff.target.files[0]], { type: stuff.target.files[0].type })
    // const blob = new Blob([stuff.target.files[0]])

    // console.log("Buffer", stuff.target.files[0] instanceof File)

    // const buffer = Buffer.from(fileReader)

    
    // const tags = exifr.parse(stuff.target.files[0]).then(output => console.log(output))

    let {latitude, longitude} = await exifr.gps('../image.jpg')

    console.log(latitude, longitude)

    // fs.readFile(stuff.target.files[0].webkitRelativePath)
    //   .then(exifr.parse)
    //   .then(output => console.log(output))

    // Calculate latitude decimal
      // var latDegree = tags.GPSLatitude[0].numerator;
      // var latMinute = tags.GPSLatitude[1].numerator;
      // var latSecond = tags.GPSLatitude[2].numerator;
      // var latDirection = tags.GPSLatitudeRef;
      // var latFinal = ConvertDMSToDD(latDegree, latMinute, latSecond, latDirection);
      // console.log(latFinal);
      // // Calculate longitude decimal
      // var lonDegree = tags.GPSLongitude[0].numerator;
      // var lonMinute = tags.GPSLongitude[1].numerator;
      // var lonSecond = tags.GPSLongitude[2].numerator;
      // var lonDirection = tags.GPSLongitudeRef;
      // var lonFinal = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDirection);
      // console.log(lonFinal);


      // const layer = new VectorLayer({
      //   title: 'Diltz\' House',
      //   source: new olSourceVector({
      //     features: [new olFeature({
      //       feature_type: ['the lake house'],
      //       title: 'the lake house',
      //       name: 'the lake house',
      //       geometry: new olGeomPoint(olProj.fromLonLat([lonFinal, latFinal]))
      //     })]
      //   })
      // })
      // map.addLayer(layer)


  }

  render() {
    return (
      <>
        <Dialog
          open={this.state.open}
        >
          <DialogTitle>Upload Pothole Image</DialogTitle>
          <DialogContent>
            <Typography>Upload your file!</Typography> 
            <Input type='file' onChange={(e) => {
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