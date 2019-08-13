export const findCurrentStepIndex = nextSteps => {
  const stepsLength = nextSteps.length
  let currentStepIndex = nextSteps.findIndex(
    step => step.status === 'Not Started'
  )

  if (currentStepIndex === -1) {
    currentStepIndex = stepsLength - 1
  }

  return currentStepIndex
}
