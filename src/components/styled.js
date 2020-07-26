import styled from 'styled-components'
import { motion } from 'framer-motion'


export const Header = styled.div`
height: 30%;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
`

export const Content = styled.div`
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

export const PillContainer = styled.div`
width: 135px;
background: rgb(236, 236, 236);
border-radius: 50px;
height: 37px;
position: relative;

&:hover {
  cursor: pointer;
}
`

export const Slider = styled.div`
  height: 100%;
  width: 52%;
  background: rgb(201, 201, 201);
  position: absolute;
  border-radius: 50px;
  top: 0px;
  transition: left 0.3s ease 0s;
  left: ${props => props.activePage === 0 ? '0px' : '48%'};
`

export const PillText = styled.p`
  z-index: 5;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #424242;
`

export const Card = styled(motion.div)`
  min-height: 200px;
  margin: 0;
  border-radius: 15px;
  overflow: hidden;
  max-width: 600px;
  box-shadow: none;
  background: #f3f3f3;
  max-height: 250px;
  cursor: pointer;
  transition: left 0.3s ease 0s;

  &:hover {
    background: #00000075
  }
`

export const CardBack = styled.div`
  max-width: 600px;
  width: 90%;
  overflow: show;
  position: relative;
  margin: 20px;
`

export const ModalCard = styled(motion.div)`
  width: ${p => p.width}px;
  height: 100vh;
  min-height: 90px;
  overflow: hidden;
  max-width: 600px;
  background: white;
  position: fixed;
  will-change: opacity;
  max-width: 990px;
  z-index: 10;
  box-shadow: 0px 10px 20px #222222a6;
  background: #f3f3f3;
  top: 0;
  max-width: 900px;
  max-height: 900px;
  border-radius: 15px;
`

export const ModalCloseButton = styled.i`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.67);
  color: white;
  border-radius: 50px;
  padding: 1px;
  cursor: pointer;
`

export const CardContent = styled(motion.div)`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
`

export const CardPriority = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 15px;
`
export const CardMotionImage = styled(motion.img)`
  width: 100%;
  height: 50%;
`

export const CardFooter = styled.p`
  float: right;
  margin: 0;
  color: white;
  bottom: 0;
  font-weight: 700;
`

export const PageTitle = styled.h5`
  margin: 30px 0px;
  font-weight: 700;
  color: #424242;
`

export const MapContainer = styled.div`
  height: 70%;
  width: 100%;
  position: absolute;
  right: ${props => props.activePage === 0 ? `-${props.width}px` : '0'};
  transition: all .3s;
  top: 30%;
  bottom: unset;
  left: unset;
`

export const ModalImageText = styled.div`
  position: absolute;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  /* align-items: flex-end; */
  left: 0px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;

`

export const ModalImageButtons = styled.div`
  position: absolute;
  bottom: 5px;
  right: 0px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 5px;
`

export const PriorityButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 3px;
  background: ${p => p.selectionColor || '#424242'};
  color: ${p => p.selected ? 'black' : p.color};
`

export const FiltersMenu = styled(motion.div)`
  position: absolute;
  top: 25%;
  right: 20px;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  background: white;
  z-index: 20;
  box-shadow: 0px 10px 20px #222222a6;
`
