import { CBT_ROUTE, FULL_LICENCE_ROUTE } from './constants'

export const matchStepsToGoal = (goal, userSteps) => {
  const { constant } = goal
  const route =
    constant === 'GOAL_SOCIAL_ANY_BIKE' ? FULL_LICENCE_ROUTE : CBT_ROUTE

  return route.map(routeStep => {
    const userStep = userSteps.find(userStep => routeStep === userStep.constant)
    const isCompleted = userStep.is_completed

    return {
      ...userStep,
      status: 'Not Started',
      ...(isCompleted && { status: 'Completed ' }),
      ...(userStep.constant === 'STEP_START' && { status: 'Start' }),
      ...(userStep.constant === 'STEP_RIDE' && { status: 'Ride' })
    }
  })
}
