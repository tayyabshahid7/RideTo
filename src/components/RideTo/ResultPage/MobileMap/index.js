import React, { useEffect } from 'react'
import styles from './styles.scss'

function MobileMap({ children, handleCloseMap }) {
  useEffect(() => {
    document.body.classList.add('map-open')
    window.scrollTo(0, 0)

    return () => {
      document.body.classList.remove('map-open')
    }
  }, [])

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleCloseMap}>
        Exit map
      </button>
      <div className={styles.map}>{children}</div>
    </div>
  )
}

export default MobileMap
