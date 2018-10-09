import React from 'react'

import Rating from 'components/Rating'
import Button from 'components/RideTo/Button'
import styles from './DashboardReview.scss'

class DashboardReview extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      rating: 0,
      review: ''
    }

    this.handleChangeRating = this.handleChangeRating.bind(this)
    this.handleChangeReview = this.handleChangeReview.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChangeRating(rating) {
    console.log('ChangeRating', rating)
    this.setState({ rating })
  }

  handleChangeReview({ target }) {
    const review = target.value
    this.setState({ review })
  }

  handleSubmit() {
    const { order, onSubmit } = this.props
    const { review, rating } = this.state

    onSubmit({
      review,
      rating,
      order: order.id
    })
  }

  render() {
    const { rating, review } = this.state

    return (
      <div className={styles.dashboardReview}>
        <h5>My Review</h5>
        <div className={styles.rating}>
          <span>Rating</span>
          <Rating rating={rating} onChange={this.handleChangeRating} />
        </div>

        <h6>Review</h6>
        <textarea value={review} onChange={this.handleChangeReview} />

        <div className={styles.action}>
          <Button
            className={styles.submit}
            disabled={!review}
            onClick={this.handleSubmit}>
            <span>Submit</span>
          </Button>
        </div>
      </div>
    )
  }
}

export default DashboardReview
