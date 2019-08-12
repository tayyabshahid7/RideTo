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

function NextStep({ nextStep, handleCompletedClick }) {
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
  } = nextStep
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
            onChange={handleCompletedClick}>
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
            onChange={handleCompletedClick}>
            <div>I have completed this step</div>
          </Checkbox>
        )}
      </div>
    </div>
  )
}

export default NextStep
