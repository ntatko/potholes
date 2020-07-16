import React, { Component } from 'react'

class Sidebar extends Component {
  render () {
    return (
      <div className="row" style={{ position: 'absolute', top: '15px', left: '15px' }}>
        <div className="col s12 m6">
          <div className="card" style={{ minWidth: '450px' }}>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'light-gray' }}>
              <span className="card-title">Potholes</span>
              <button style={{ backgroundColor: 'navy' }} onClick={this.props.showModal} className='waves-effect waves-light btn'>Upload Image</button>
              </div>

              <ul className="collection">
                <li className="collection-item"  ><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: High</p>
              </div>
                <p>Uploaded Date: 04/30/1992</p></li>
                <li className="collection-item"><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: Medium</p>
                </div>
                <p>Uploaded Date: 04/30/1992</p></li>
                <li className="collection-item"><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: Low</p>
                </div>
                <p>Uploaded Date: 04/30/1992</p></li>
              </ul>
              
              {/* <div className="card" style={{ padding: '10px', background: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: High</p>
              </div>
                <p>Uploaded Date: 04/30/1992</p>
              </div>
              
              <div className="card" style={{ padding: '10px', background: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: Medium</p>
                </div>
                <p>Uploaded Date: 04/30/1992</p>
              </div>
              <div className="card" style={{ padding: '10px', background: 'white' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>Location: 38.12341, 98.5432341</p>
                <p>Priority: low</p>
                </div>
                <p>Uploaded Date: 04/30/1992</p>
              </div> */}
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
