import React, { Component } from 'react'
import classnames from 'classnames'
import MapGL, { Marker, NavigationControl } from 'react-map-gl'
import styles from './styles.scss'
import { MAPBOX_KEY } from 'common/constants'
import { IconMapPin, IconUser } from 'assets/icons'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = MAPBOX_KEY

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

class MapComponent extends Component {
  constructor(props) {
    super(props)
    const { userLocation, courses } = this.props
    let location = userLocation ? userLocation : courses[0]
    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: location.lat,
        longitude: location.lng,
        zoom: 8
      }
    }
    this.updateViewport = this.updateViewport.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.renderPin = this.renderPin.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions() {
    const { viewport } = this.state
    this.setState({
      viewport: {
        ...viewport,
        height: this.refs.mapContainer.offsetHeight,
        width: this.refs.mapContainer.offsetWidth
      }
    })
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
        <IconMapPin className={styles.mapPinBg} />
        {course.price && (
          <span className={styles.pinPrice}>
            £{parseInt(course.price / 100, 10)}
          </span>
        )}
      </div>
    )
  }

  render() {
    const { courses, className, userLocation } = this.props
    const { viewport } = this.state
    return (
      <div
        className={classnames(styles.container, className)}
        ref="mapContainer">
        <MapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          zoom={10}
          mapboxApiAccessToken={MAPBOX_KEY}
          onViewportChange={viewport => this.setState({ viewport })}>
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <div id={`user-pin`} className={styles.coursePin}>
                <IconMapPin className={styles.mapPinBg} />
                <IconUser className={styles.userIcon} />
              </div>
            </Marker>
          )}
          {courses && courses.map(this.renderMarker)}
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
        </MapGL>
      </div>
    )
  }
}

export default MapComponent
