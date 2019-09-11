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

export const findLastStepIndex = (nextSteps, skipItm) => {
  let lastStepIndex =
    nextSteps.map(({ status }) => status).lastIndexOf('Completed') + 1

  if (skipItm && nextSteps[lastStepIndex].constant === 'STEP_ITM') {
    ++lastStepIndex
  }

  return lastStepIndex
}
