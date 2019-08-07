import React, { Fragment } from 'react'
import styles from './styles.scss'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import classnames from 'classnames'

function FAQs({ questions }) {
  return (
    <Fragment>
      <h3 className={classnames(styles.subtitle, styles.subtitleFaq)}>FAQs</h3>
      <CourseTypeDetails
        courseType={{
          details: questions
        }}
        minimal
        useKeysAsTitle
        titleStyle={{
          fontWeight: 'normal',
          fontFamily: 'var(--font-rift-bold)'
        }}
        contentStyle={{
          opacity: 1,
          fontSize: '15px',
          lineHeight: '24px',
          textAlign: 'left'
        }}
      />
    </Fragment>
  )
}

export default FAQs
