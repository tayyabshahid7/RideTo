import { RidingExperiences, PaymentStatus } from 'common/info'

const initialState = {
  ridingExperiences: RidingExperiences,
  paymentStatus: PaymentStatus
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
