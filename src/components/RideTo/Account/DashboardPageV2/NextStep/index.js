import React, { Fragment } from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import Button from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import Form from './Form'
import Checkbox from 'components/Checkbox'
import CircleList from '../CircleList'
import FAQs from '../FAQs'
import UpComingCourse from '../UpComingCourse'
import CourseFeedback from '../CourseFeedback'
import Slider from '../Slider'
import StatusIcon from '../StatusIcon'
import { useMediaQuery } from 'react-responsive'
import WithTitle from './WithTitle'
import classnames from 'classnames'

const NEXT_STEP = {
  title: 'Theory Test',
  // course: null,
  // feedBack: true,
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  // included: {
  //   title: 'What you need',
  //   items: ['Bike & helmet hire', 'Test fees & fuel']
  // },
  guides: {
    title: 'Useful guides',
    items: [{ title: 'What to Prepare For Your CBT Training?', url: '/' }]
  },
  // faqs: {
  //   "What's included?": 'Ut in.',
  //   'What do I need to bring?': 'Lorem ipsum sit dolore anim.'
  // }
  form: {
    icon: '',
    // label: 'Postcode',
    // action: '/',
    href: '/',
    buttonText: 'Book local instructor'
  }
  // cta: {
  //   href: '/',
  //   text: 'Labore excepteur '
  // }
  // gear: [
  //   {
  //     name: 'Bikes',
  //     link: '/',
  //     image: 'https://via.placeholder.com/120x62'
  //   },
  //   {
  //     name: 'Gloves',
  //     link: '/',
  //     image: 'https://via.placeholder.com/62x120'
  //   }
  // ]
}

function NextStep() {
  const {
    title,
    course,
    feedBack,
    introduction,
    included,
    guides,
    faqs,
    form,
    cta,
    gear
  } = NEXT_STEP
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrap}>
            <StatusIcon status="Next Step" transparent pulsate />
          </div>
          <h2 className={styles.title}>
            Next step <span>{title}</span>
          </h2>
        </div>
        {isDesktop && (
          <Checkbox
            extraClass={styles.dashboardCheck}
            size="smallBlack"
            onChange={event => console.log(event)}>
            <div>I have completed this step</div>
          </Checkbox>
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.leftCol}>
          <div className={styles.row}>
            {feedBack ? (
              <CourseFeedback />
            ) : (
              <Fragment>
                {course && <UpComingCourse />}
                {introduction && (
                  <WithTitle title={introduction.title}>
                    <p>{introduction.text}</p>
                  </WithTitle>
                )}
                {included && (
                  <WithTitle title={included.title}>
                    <OrderIncluded items={included.items} />
                  </WithTitle>
                )}
                {guides && (
                  <WithTitle title={guides.title}>
                    <CircleList size="small" items={guides.items} />
                  </WithTitle>
                )}
                {faqs && <FAQs questions={faqs} />}
              </Fragment>
            )}
          </div>
          {cta && (
            <Button href={cta.href} alt modern className={styles.cta}>
              <span>{cta.text}</span>
              <img src={ArrowRight} alt="" />
            </Button>
          )}
        </div>
        {form ? (
          <div className={styles.rightCol}>
            <Form form={form} />
          </div>
        ) : gear ? (
          <div className={classnames(styles.rightCol, styles.rightColSlider)}>
            <Slider gear={gear} />
          </div>
        ) : null}
        {!isDesktop && (
          <Checkbox
            extraClass={styles.dashboardCheck}
            size="smallBlack"
            onChange={event => console.log(event)}>
            <div>I have completed this step</div>
          </Checkbox>
        )}
      </div>
    </div>
  )
}

export default NextStep
