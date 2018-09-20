import React, { Component } from 'react'
import classnames from 'classnames'
import MapGL, { Marker, NavigationControl } from 'react-map-gl'
import styles from './styles.scss'
import { MAPBOX_KEY } from 'common/constants'
import { IconMapPin, IconUser } from 'assets/icons'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = MAPBOX_KEY
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl'

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
      // viewport: {
      //   latitude: 45.0523,
      //   longitude: 63.234,
      //   zoom: 9,
      //   bearing: 0,
      //   pitch: 0,
      //   width: 400, // widthPx || mapDivContainer.offsetWidth,
      //   height: 800 // heightPx || height,
      // }
      viewport: {
        width: 400,
        height: 400,
        // width: '100%',
        // height: '100%',
        latitude: this.props.courses[0].lat,
        longitude: this.props.courses[0].lng,
        zoom: 8
      }
    }
    this.updateViewport = this.updateViewport.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.renderPin = this.renderPin.bind(this)
  }

  componentDidMount() {
    //   const map = new mapboxgl.Map({
    //     container: 'map-div',
    //     style: 'mapbox://styles/mapbox/streets-v9'
    // });
    console.log('Map Container', this.refs)
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
    console.log('Viewport', viewport)
    // this.setState({ viewport })
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
        <span className={styles.pinPrice}>
          £{parseInt(course.price / 100, 10)}
        </span>
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
