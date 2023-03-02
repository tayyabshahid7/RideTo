import classNames from 'classnames'
import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { parseQueryString } from 'services/api'
import styles from './styles.scss'

import { IconLocale } from 'assets/icons'

function MobileMap({ children, isLoadingMap, handleMyLocation }) {
  const qs = parseQueryString(window.location.search.slice(1))
  const courseType = qs.courseType ? qs.courseType : 'LICENCE_CBT'

  return (
    <div
      className={classNames(
        styles.container,
        courseType === 'FULL_LICENCE' && styles.containerFullLicence
      )}>
      <button className={styles.closeButton} onClick={handleMyLocation}>
        <IconLocale />
      </button>

      <ThreeDots
        height="20"
        width="50"
        radius="9"
        color="#2cceac"
        ariaLabel="three-dots-loading"
        wrapperStyle={{
          position: 'fixed',
          marginTop: '12px',
          left: '40%',
          zIndex: 1000,
          backgroundColor: '#f7f7f7',
          padding: '10px 20px',
          borderRadius: '50px'
        }}
        wrapperClassName={styles.loading}
        visible={isLoadingMap}
      />

      <div className={styles.map}>{children}</div>
    </div>
  )
}

export default MobileMap
