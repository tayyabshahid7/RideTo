import React, { Component } from 'react'
import classnames from 'classnames'
import MapGL, { Marker, NavigationControl } from 'react-map-gl'
import styles from './styles.scss'
import { MAPBOX_KEY } from 'common/constants'
import 'mapbox-gl/dist/mapbox-gl.css'

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 45.0523,
        longitude: 63.234,
        zoom: 9,
        bearing: 0,
        pitch: 0,
        width: 400, // widthPx || mapDivContainer.offsetWidth,
        height: 800 // heightPx || height,
      }
    }
    this.updateViewport = this.updateViewport.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.renderPin = this.renderPin.bind(this)
  }

  updateViewport(viewport) {
    this.setState({ viewport })
  }

  renderMarker(course, index) {
    if (course.lng && course.lat) {
      return (
        <Marker key={course.id} longitude={course.lng} latitude={course.lat}>
          {this.renderPin(course)}
        </Marker>
      )
    }
    return null
  }

  renderPin(course) {
    return (
      <div id={`course-${course.id}`} className={styles.coursePin}>
        {course.price}
      </div>
    )
  }

  render() {
    const { courses, className } = this.props
    const { viewport } = this.state
    return (
      <div className={classnames(styles.container, className)}>
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          onViewportChange={this.updateViewport}
          mapboxApiAccessToken={MAPBOX_KEY}>
          <div />
          {courses && courses.map(this.renderMarker)}
          {/* {this._renderPopup()} */}
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
        </MapGL>
      </div>
    )
  }
}

export default MapComponent
