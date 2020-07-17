import React, { Component } from 'react'
import { SegmentedControl } from 'segmented-control'

import potholeone from '../potholeone.png'
import pothole2 from '../pothole2.png'
import pothole3 from '../pothole3.png'

import styled from 'styled-components'
import '../App.css';

const container = {
  height: '100%'
}

const Header = styled.div`
  height: 30%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const Content = styled.div`
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  border-radius: 15px;
  overflow: hidden;
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

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = { activePage: 0 }
  }

  render () {
    return (
      <div style={container}>
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
        <Content>
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
        </Content>
      </div>
    )
  }
}

export default Home
