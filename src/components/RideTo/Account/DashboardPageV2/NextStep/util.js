import moment from 'moment'
import NEXT_STEPS from './constants'

export const getNextStepConstant = (nextStep, recentOrder) => {
  let { constant } = nextStep
  const recentTrainingCourseType =
    recentOrder && recentOrder.trainings[0].course_type

  if (constant === 'STEP_CBT') {
    if (recentTrainingCourseType === 'CBT Training') {
      const recentTraining = recentOrder.trainings[0]
      const date = recentTraining.date || recentTraining.requested_date
      const today = moment().format('YYYY-MM-DD')

      if (today > date) {
        return 'STEP_CBT_POST'
      }

      return 'STEP_CBT_BOOKED'
    }

    if (recentTrainingCourseType === 'Full Licence Training') {
      return 'STEP_CBT_POST'
    }

    return 'STEP_CBT_BEFORE'
  }

  if (constant === 'STEP_FULL_LICENCE') {
    if (recentTrainingCourseType === 'Full Licence Training') {
      return 'STEP_FULL_LICENCE_BOOKED'
    }

    return 'STEP_FULL_LICENCE_BEFORE'
  }

  return constant
}

export const getNextStep = constant => {
  return NEXT_STEPS.find(nextStep => nextStep.id === constant)
}
