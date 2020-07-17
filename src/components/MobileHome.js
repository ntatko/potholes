import React, { Component } from 'react'
import Logo from '../logo.png'
import EXIF from 'exif-js'
import { withRouter } from 'react-router-dom'


const container = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'center'
}

const buttonContainer = {
  display: 'flex',
  flexDirection: 'column',
  width: '75%'
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
  if (direction == "S" || direction == "W") {
      dd = dd * -1; 
  }
  return dd;
}

class MobileHome extends Component {
  handleChange = async stuff => {
    console.log("this is the stuff", stuff.target.files[0])
    console.log("typeof", typeof stuff.target.files)
    const props = this.props
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
        
        props.history.push({
          pathname: '/mobile-map',
          state: { y: latFinal, x: lonFinal, zoom: 18 }
        })
      } else {

        navigator.geolocation.getCurrentPosition((position) => {
          props.history.push({
            pathname: '/mobile-map',
            state: { y: position.coords.latitude, x: position.coords.longitude, zoom: 18 }
          })
        })
      }
    })
  }

  render () {
    return (
      <div style={container}>
          <img style={{ width: '125px', borderRadius: '15px' }} src={Logo} alt='logo' />
        <div style={buttonContainer}>
          <div style={{ margin: '15px' }}>
            <button style={button} className='waves-effect waves-light btn'>Take Photo</button>
          </div>
          <div style={{ margin: '15px' }}>
            <button style={button} onClick={() => document.getElementById('file-upload').click()} className='waves-effect waves-light btn'>Upload Photo</button>
            <input id='file-upload' hidden='true' style={button} type='file' accept='image/*' onChange={(e) => {
              this.handleChange(e)
              this.setState({ open: false })
            }} />
          </div>
        </div>
      </div>
    )
  }

}

export default withRouter(MobileHome)
