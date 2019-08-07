import React from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import Button from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Input from 'components/RideTo/Input'
import Checkbox from 'components/Checkbox'
import CircleList from '../CircleList'
import FAQs from '../FAQs'
import UpComingCourse from '../UpComingCourse'
import CourseFeedback from '../CourseFeedback'
import Slider from '../Slider'
import StatusIcon from '../StatusIcon'

function NextStep() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIcon status="Next Step" />
      </div>
      <h2 className={styles.title}>
        Next step <span>Full Licence</span>
      </h2>
      <UpComingCourse />
      <CourseFeedback />
      <h3 className={styles.subtitle}>Introduction</h3>
      <p>
        The choice of bikes available now is immense. Whether you're looking for
        a city commuter, weekend cruiser or track day racer, our bike chooser
        will help you find and book a test ride.
      </p>
      <h3 className={styles.subtitle}>What's included</h3>
      <OrderIncluded items={['Bike & helmet hire', 'Test fees & fuel']} />
      <h3 className={styles.subtitle}>What's included</h3>
      <CircleList
        size="small"
        items={[{ title: 'What to Prepare For Your CBT Training?', url: '/' }]}
      />
      <FAQs
        questions={{
          "What's included?": 'Ut in.',
          'What do I need to bring?': 'Lorem ipsum sit dolore anim.'
        }}
      />
      <Button alt modern className={styles.cta}>
        <span>About the course</span>
        <img src={ArrowRight} alt="" />
      </Button>
      <div className={styles.icon}>
        <img
          src="https://via.placeholder.com/62x62"
          alt="Icon"
          width="62"
          height="62"
        />
      </div>
      <form>
        <Input className={styles.input} label="Postcode" />
        <Button type="submit" modern>
          <span>View Booking Details</span>
          <img src={ButtonArrowWhite} alt="" />
        </Button>
      </form>
      <Slider />
      <div>
        <Checkbox
          extraClass={styles.dashboardCheck}
          size="smallBlack"
          onChange={event => console.log(event)}>
          <div>I have completed this step</div>
        </Checkbox>
      </div>
    </div>
  )
}

export default NextStep
