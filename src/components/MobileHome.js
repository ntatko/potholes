import React, { Component } from 'react'
import Logo from '../logo.png'
import EXIF from 'exif-js'
import { withRouter } from 'react-router-dom'
import { BounceLoader } from 'react-spinners'
import axios from 'axios'
import { v4 as UUID } from 'uuid'

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
  if (direction === "S" || direction === "W") {
      dd = dd * -1; 
  }
  return dd;
}

class MobileHome extends Component {

  constructor() {
    super()

    this.state = {
      loading: false
    }
  }

  async componentDidMount() {
    await navigator.permissions.query({name:'geolocation'})
  }
  
  handleChange = async stuff => {
    console.log("this is the stuff", stuff.target.files[0])
    const props = this.props

    let url

    // upload to AWS
    const file = stuff.target.files[0];
    // Split the filename to get the name and type
    const fileParts = stuff.target.files[0].name.split('.');
    const fileType = fileParts[1];
    console.log("Preparing the upload");
    try {
      this.setState({ loading: true })
      const response = await axios.post("https://geokit-api.herokuapp.com/getSignedUrl", {
        fileName: `${new Date().toISOString()}-${UUID()}`,
        fileType
      })
      const returnData = response.data.data.returnData;
      const signedRequest = returnData.signedRequest;
      url = returnData.url;
      this.setState({ url })
      console.log("Recieved a signed request", signedRequest, url);
      
      // Put the fileType in the headers for the upload
      var options = {
        headers: {
          'Content-Type': 'image/jpeg'
        }
      };
      // fetch(signedRequest, { method: 'PUT', mode: 'no-cors', body: JSON.stringify(file)})
      const result = await axios.put(signedRequest, file, options)
      console.log("Response from s3", result)
      this.setState({success: true});
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
      } else {

        navigator.geolocation.getCurrentPosition((position) => {
          props.history.push({
            pathname: '/mobile-map',
            state: { y: position.coords.latitude, x: position.coords.longitude, zoom: 18, url }
          })
        })
      }
    })
  }

  render () {
    return (
      <div style={container}>
        <img style={{ width: '125px', borderRadius: '15px' }} src={Logo} alt='logo' />
        {this.state.loading ? (
          <>
            <BounceLoader size={80} color={'#61ccf5'}/>
          </>
        ) : (
          <div style={buttonContainer}>
            <div style={{ margin: '15px' }}>
              <button style={button} onClick={() => document.getElementById('file-upload').click()} className='waves-effect waves-light btn'>Upload Photo</button>
              <input id='file-upload' hidden='true' style={button} type='file' accept='image/*' onChange={(e) => {
                this.handleChange(e)
                this.setState({ open: false })
              }} />
            </div>
          </div>
        )}
      </div>
    )
  }

}

export default withRouter(MobileHome)
