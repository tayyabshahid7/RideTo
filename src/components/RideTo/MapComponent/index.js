import React, { Component } from 'react'
import classnames from 'classnames'
import MapGL, { Marker, NavigationControl } from 'react-map-gl'
import styles from './styles.scss'
import { MAPBOX_KEY } from 'common/constants'
import { IconMapPin, IconUser } from 'assets/icons'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import WebMercatorViewport from 'viewport-mercator-project'
import { lineString } from '@turf/helpers'
import bbox from '@turf/bbox'

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

    this.state = {
      viewport: {}
    }

    this.updateViewport = this.updateViewport.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.renderPin = this.renderPin.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.highlightResultCard = this.highlightResultCard.bind(this)
  }

  componentDidMount() {
    const { userLocation, courses } = this.props
    const locations = [
      [userLocation.lat, userLocation.lng],
      ...[...courses.available, ...courses.unavailable].map(course => [
        course.lat,
        course.lng
      ])
    ]
    const height = this.refs.mapContainer.offsetHeight
    const width = this.refs.mapContainer.offsetWidth

    let viewport = {}

    if (locations.length > 1) {
      const line = lineString(locations)
      const box = bbox(line)
      const [minLat, minLng, maxLat, maxLng] = box

      viewport = new WebMercatorViewport({
        height,
        width
      }).fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: { top: 60, right: 40, bottom: 40, left: 60 }
      })
    } else {
      viewport = {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        height,
        width,
        zoom: 10
      }
    }

    this.setState({ viewport }, () => {
      this.updateDimensions()
      window.addEventListener('resize', this.updateDimensions)
    })
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

  renderMarker(course, index, available = true) {
    if (course.lng && course.lat) {
      return (
        <Marker
          key={course.id}
          className={styles.mapMarker}
          longitude={course.lng}
          latitude={course.lat}
          offsetLeft={-25}
          offsetTop={-64}>
          {this.renderPin(course, available)}
        </Marker>
      )
    }
    return null
  }

  highlightResultCard(event) {
    const idElement = event.currentTarget.id
    const resultCard = document.getElementById(`card-${idElement}`)
    resultCard.classList.remove(styles.highlightCard)
    window.scrollTo({ top: resultCard.offsetTop, behavior: 'smooth' })
    resultCard.classList.add(styles.highlightCard)
  }

  renderPin(course, available) {
    return (
      <div
        id={`course-${course.id}`}
        onClick={this.highlightResultCard}
        className={styles.coursePin}>
        <IconMapPin
          className={classnames(
            styles.mapPinBg,
            !available && styles.mapPinBgUnavailable
          )}
        />
        <span className={styles.pinPrice}>
          {course.price ? `£${parseInt(course.price / 100, 10)}` : '-'}
        </span>
      </div>
    )
  }

  render() {
    const { courses = {}, className, userLocation, checkout } = this.props
    const { viewport } = this.state
    const { available, unavailable } = courses

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
            <Marker
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              offsetLeft={-25}
              offsetTop={-64}>
              <div id={`user-pin`} className={styles.coursePin}>
                <IconMapPin className={styles.mapPinBg} />
                <IconUser className={styles.userIcon} />
              </div>
            </Marker>
          )}
          {unavailable &&
            unavailable.map((course, index) =>
              this.renderMarker(course, index, false)
            )}
          {available && available.map(this.renderMarker)}
          {available === undefined &&
            unavailable === undefined &&
            !checkout &&
            courses.map(this.renderMarker)}
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
        </MapGL>
      </div>
    )
  }
}

export default MapComponent
