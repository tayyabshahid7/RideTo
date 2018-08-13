import { RidingExperiences, PaymentStatus } from 'common/info'

const initialState = {
  ridingExperiences: RidingExperiences,
  paymentStatus: PaymentStatus
}

export const info = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}
