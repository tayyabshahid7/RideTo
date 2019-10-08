import React, { Fragment, useEffect, useState } from 'react'
import styles from './styles.scss'
import OrderIncluded from 'components/RideTo/CheckoutPage/OrderIncluded'
import Button from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import Form from './Form'
import CircleList from '../CircleList'
import FAQs from '../FAQs'
import UpComingCourse from '../UpComingCourse'
import CourseFeedback from '../CourseFeedback'
import Slider from '../Slider'
import StatusIcon from '../StatusIcon'
import { useMediaQuery } from 'react-responsive'
import WithTitle from './WithTitle'
import classnames from 'classnames'
import { getNextStep, getNextStepConstant } from './util'
import MyCheckbox from './MyCheckbox'
import { fetchBikes } from 'services/dashboard'

function NextStep({
  nextStep,
  handleCompletedClick,
  recentOrder,
  cbtStatus,
  dasStatus,
  selectedGoal
}) {
  const constant = getNextStepConstant(nextStep, recentOrder)
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
    gear,
    id
  } = getNextStep(constant)
  const isDesktop = useMediaQuery({ minWidth: 1025 })
  const status = constant === 'STEP_CBT_POST' ? cbtStatus : dasStatus
  const feedBackCourseType = constant === 'STEP_CBT_POST' ? 'cbt' : 'das'
  const [bikes, setBikes] = useState([])

  useEffect(() => {
    if (constant === 'STEP_BIKE') {
      async function fetchMyBikes() {
        const response = await fetchBikes(selectedGoal)

        setBikes(
          response.results.map(bike => {
            return {
              name: bike.bike_model,
              link: bike.url,
              image: bike.images[0].image
            }
          })
        )
      }

      fetchMyBikes()
    }
  }, [constant, selectedGoal])

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
        {isDesktop && constant !== 'STEP_RIDE' && (
          <MyCheckbox
            handleCompletedClick={handleCompletedClick}
            id={id}
            checked={nextStep.is_completed}
          />
        )}
      </div>
      <div className={styles.main}>
        <div className={styles.leftCol}>
          <div className={styles.row}>
            {feedBack ? (
              <CourseFeedback status={status} courseType={feedBackCourseType} />
            ) : (
              <Fragment>
                {course && recentOrder && (
                  <UpComingCourse course={recentOrder} />
                )}
                {introduction && (
                  <WithTitle title={introduction.title}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: introduction.text
                      }}></p>
                    {introduction.list && (
                      <ul className={styles.introductionList}>
                        {introduction.list.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </WithTitle>
                )}
                {included && (
                  <WithTitle title={included.title}>
                    {recentOrder ? (
                      <OrderIncluded
                        fullLicence={included.type === 'das'}
                        bikeHire={recentOrder.bike_type.toLowerCase()}
                        hasGloves={recentOrder.gloves_jacket_included}
                      />
                    ) : (
                      <OrderIncluded items={included.items} />
                    )}
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
            <Button
              href={cta.href}
              alt
              modern
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer">
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
            <Slider
              gear={constant === 'STEP_BIKE' ? bikes : gear}
              constant={constant}
            />
          </div>
        ) : null}
        {!isDesktop && constant !== 'STEP_RIDE' && (
          <MyCheckbox
            handleCompletedClick={handleCompletedClick}
            id={id}
            checked={nextStep.is_completed}
          />
        )}
      </div>
    </div>
  )
}

export default NextStep
