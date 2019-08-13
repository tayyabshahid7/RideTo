import NEXT_STEPS from './constants'

export const getNextStepConstant = nextStep => {
  let { constant } = nextStep

  if (constant === 'STEP_CBT') {
    return 'STEP_CBT_BEFORE'
  }

  if (constant === 'STEP_FULL_LICENCE') {
    return 'STEP_FULL_LICENCE_BEFORE'
  }

  return constant
}

export const getNextStep = constant => {
  return NEXT_STEPS.find(nextStep => nextStep.id === constant)
}
