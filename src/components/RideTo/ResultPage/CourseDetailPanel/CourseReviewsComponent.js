import React from 'react'
import styles from './styles.scss'
import ReviewItem from './ReviewItem'

class CourseReviewComponent extends React.Component {
  render() {
    const { course } = this.props

    return (
      <div className={styles.content}>
        <div className={styles.subtitle}>
          {course.number_of_reviews} Reviews
        </div>
        <div className={styles.reviews}>
          {course.ratings.map(review => <ReviewItem review={review} />)}
        </div>
      </div>
    )
  }
}

export default CourseReviewComponent
