import React, { Component } from 'react'
import Logo from '../logo.png'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-timing-function: ease;
`

class SplashScreen extends Component {
  render () {
    return (
      <Container>
        <img style={{ width: '125px', borderRadius: '15px' }} src={Logo} alt='logo' />
      </Container>
    )
  }
}

export default SplashScreen
