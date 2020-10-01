import {
  fetchSingleCourse,
  fetchCourses,
  fetchCoursesMinimal,
  fetchUserCourses,
  deleteSingleCourse,
  addSchoolOrder,
  addSchoolPayment,
  fetchSchoolOrder,
  updateSchoolOrder,
  deleteSchoolOrderTraining,
  updateSchoolCourse,
  createSchoolCourse,
  createBulkSchoolCourse,
  getPricingForCourse,
  fetchDayCourseTimes,
  updateDefaultBikeHire
} from 'services/course'
import { CALENDAR_VIEW } from 'common/constants'
import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from './common'
import { FETCH_SINGLE as FETCH_SINGLE_EVENT } from './event'
import { actions as notificationActions } from './notification'
import moment from 'moment'
import { saveState } from 'services/localStorage'
import { resetLoadedMonths, loadMonthDay } from 'store/staff'
import { resetUsers } from 'store/calendar'

const FETCH_ALL = createRequestTypes('rideto/course/FETCH/ALL')
const FETCH_FOR_FORM = createRequestTypes('rideto/course/FETCH/FORM')
const UPDATE_CALENDAR_SETTING = 'rideto/course/UPDATE/CALENDAR_SETTING'
const RESET_DATA = 'rideto/course/RESET_DATA'
const FETCH_FOR_DAY = createRequestTypes('rideto/course/FETCH/DAY')
const FETCH_SINGLE = createRequestTypes('rideto/course/FETCH/SINGLE')
const FETCH_PRICE = createRequestTypes('rideto/course/FETCH/PRICE')
const RESET_PRICE = 'rideto/course/RESET/PRICE'
const DELETE = createRequestTypes('rideto/course/DELETE')
const UPDATE = createRequestTypes('rideto/course/UPDATE')
const CREATE = createRequestTypes('rideto/course/CREATE')
const CREATE_BULK = createRequestTypes('rideto/course/CREATE_BULK')
const CREATE_ORDER = createRequestTypes('rideto/course/CREATE/ORDER')
const CREATE_PAYMENT = createRequestTypes('rideto/course/CREATE/PAYMENT')
const FETCH_ORDER = createRequestTypes('rideto/course/FETCH/ORDER')
const DELETE_ORDER = createRequestTypes('rideto/course/FETCH/DELETE_ORDER')
const UPDATE_ORDER = createRequestTypes('rideto/course/UPDATE/ORDER')
const UNSET_DAY = 'rideto/course/UNSET/DAY'
const SHIFT_DELETED = 'rideto/course/SHIFT/DELETED'
const UNSET_SELECTED_COURSE = 'rideto/course/UNSET/SELECTED_COURSE'
const FETCH_TIMES = createRequestTypes('rideto/course/FETCH_TIMES')
const ADD_PACKAGE = 'rideto/course/PACKAGE/ADD'
const CANCEL_PACKAGE = 'rideto/course/PACKAGE/CANCEL'
const ADD_COURSE_TO_PACKAGE = 'rideto/course/PACKAGE/ADD_COURSE'
const REMOVE_COURSE_FROM_PACKAGE = 'rideto/course/PACKAGE/REMOVE_COURSE'
const UPDATE_DEFAULT_BIKES = createRequestTypes(
  'rideto/course/UPDATE_DEFAULT_BIKES'
)

export const addCourseToPackage = course => dispatch => {
  dispatch({ type: ADD_COURSE_TO_PACKAGE, data: course })
}

export const removeCourseFromPackage = course => dispatch => {
  dispatch({ type: REMOVE_COURSE_FROM_PACKAGE, data: course })
}

export const addCoursePackage = course => dispatch => {
  dispatch({ type: ADD_PACKAGE, data: course })
}

export const cancelCoursePackage = () => dispatch => {
  dispatch({ type: CANCEL_PACKAGE })
}

export const resetData = () => dispatch => {
  dispatch({ type: RESET_DATA })
}

export const shiftDeleted = courses => dispatch => {
  dispatch({ type: SHIFT_DELETED, data: { courses } })
}

export const getSingleCourse = ({
  courseId,
  reset = false
}) => async dispatch => {
  dispatch({ type: FETCH_SINGLE[REQUEST], reset })

  try {
    const course = await fetchSingleCourse(courseId)
    dispatch({
      type: FETCH_SINGLE[SUCCESS],
      data: {
        course
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_SINGLE[FAILURE], error })
  }
}

export const updateDefaultBikes = (
  settings,
  courseType,
  schoolId
) => async dispatch => {
  dispatch({ type: UPDATE_DEFAULT_BIKES[REQUEST] })
  try {
    await updateDefaultBikeHire(settings, courseType, schoolId)
    dispatch({
      type: UPDATE_DEFAULT_BIKES[SUCCESS],
      data: {
        settings,
        courseType,
        schoolId
      }
    })
  } catch (error) {
    dispatch({ type: UPDATE_DEFAULT_BIKES[FAILURE], error })
  }
}

export const getDayCourses = ({ schoolIds, date }) => async dispatch => {
  dispatch({ type: FETCH_FOR_DAY[REQUEST], date })
  try {
    const request = schoolIds.map(schoolId =>
      fetchCourses(schoolId, date, date)
    )
    const results = await Promise.all(request)

    const courses = []
    results.forEach(tmp => courses.push(...tmp))

    dispatch({
      type: FETCH_FOR_DAY[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_FOR_DAY[FAILURE], error })
  }
}

export const getDayCourseTimes = (
  { schoolId, date, course_type, bike_type, full_licence_type },
  defaultTime
) => async dispatch => {
  dispatch({ type: FETCH_TIMES[REQUEST] })

  try {
    const times = await fetchDayCourseTimes(
      schoolId,
      date,
      course_type,
      bike_type,
      full_licence_type
    )

    dispatch({
      type: FETCH_TIMES[SUCCESS],
      data: {
        times,
        defaultTime
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_TIMES[FAILURE], error })
  }
}

export const deleteCourse = ({ courseId }) => async dispatch => {
  dispatch({ type: DELETE[REQUEST] })

  try {
    await deleteSingleCourse(courseId)
    notificationActions.dispatchSuccess(dispatch, 'Course deleted')
    dispatch({
      type: DELETE[SUCCESS],
      data: {
        courseId
      }
    })
  } catch (error) {
    dispatch({ type: DELETE[FAILURE], error })
  }
}

export const getCourses = ({
  schoolId,
  firstDate,
  lastDate,
  month,
  reset
}) => async dispatch => {
  dispatch({ type: FETCH_ALL[REQUEST] })

  const diff = moment
    .duration(moment(lastDate).diff(moment(firstDate)))
    .asDays()

  try {
    const courses =
      diff > 10
        ? await fetchCoursesMinimal(schoolId, firstDate, lastDate)
        : await fetchCourses(schoolId, firstDate, lastDate)

    dispatch({
      type: FETCH_ALL[SUCCESS],
      data: {
        courses,
        month,
        reset
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_ALL[FAILURE], error })
  }
}

export const getDaysCourses = ({ start_date, end_date }) => async dispatch => {
  dispatch({ type: FETCH_FOR_FORM[REQUEST] })

  try {
    const courses = await fetchUserCourses(start_date, end_date)

    dispatch({
      type: FETCH_FOR_FORM[SUCCESS],
      data: {
        courses
      }
    })
  } catch (error) {
    dispatch({ type: FETCH_FOR_FORM[FAILURE], error })
  }
}

export const updateCalendarSetting = data => async dispatch => {
  if (data.viewMode === CALENDAR_VIEW.SHIFT) {
    dispatch(resetUsers())
  }
  dispatch({ type: UPDATE_CALENDAR_SETTING, data })
}

export const unsetSelectedDate = data => async dispatch => {
  dispatch({ type: UNSET_DAY })
}

export const unsetSelectedCourse = data => async dispatch => {
  dispatch({ type: UNSET_SELECTED_COURSE })
}

export const createSchoolOrder = ({ schoolId, order }) => async dispatch => {
  let response = false
  dispatch({ type: CREATE_ORDER[REQUEST] })

  try {
    response = await addSchoolOrder(schoolId, order)
    dispatch({
      type: CREATE_ORDER[SUCCESS],
      data: {
        course: response
      }
    })
    notificationActions.dispatchSuccess(dispatch, 'Order added')
    if (response.email_success) {
      notificationActions.dispatchSuccess(dispatch, 'Email sent')
    }
    if (response.sms_success) {
      notificationActions.dispatchSuccess(dispatch, 'SMS sent')
    }
    dispatch(
      getSingleCourse({
        schoolId,
        courseId: order.school_course,
        reset: false
      })
    )
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to add Order')
    dispatch({ type: CREATE_ORDER[FAILURE], error })
    return false
  }
  return response
}

export const createSchoolPayment = (schoolId, data) => async dispatch => {
  dispatch({ type: CREATE_PAYMENT[REQUEST] })
  try {
    await addSchoolPayment(schoolId, data)
    dispatch({
      type: CREATE_PAYMENT[SUCCESS]
    })
  } catch (error) {
    const message = error.response.data.detail
    notificationActions.dispatchError(
      dispatch,
      `Failed to take payment. ${message}`
    )
    dispatch({ type: CREATE_PAYMENT[FAILURE], error })
    return false
  }
  return true
}

export const getSchoolOrder = trainingId => async dispatch => {
  dispatch({ type: FETCH_ORDER[REQUEST] })
  try {
    const response = await fetchSchoolOrder(trainingId)
    dispatch({
      type: FETCH_ORDER[SUCCESS],
      data: { order: response }
    })
  } catch (error) {
    dispatch({ type: FETCH_ORDER[FAILURE], error })
    return false
  }
  return true
}

export { updateSchoolOrder }

export const updateOrder = ({ trainingId, order }) => async dispatch => {
  dispatch({ type: UPDATE_ORDER[REQUEST] })
  try {
    const response = await updateSchoolOrder(trainingId, order)
    notificationActions.dispatchSuccess(dispatch, 'Order saved')
    dispatch({
      type: UPDATE_ORDER[SUCCESS],
      data: { order: response }
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save Order')
    dispatch({ type: UPDATE_ORDER[FAILURE], error })
    return false
  }
  return true
}

export const deleteOrderTraining = (schoolId, trainingId) => async dispatch => {
  dispatch({ type: DELETE_ORDER[REQUEST] })

  try {
    await deleteSchoolOrderTraining(schoolId, trainingId)
    notificationActions.dispatchSuccess(dispatch, 'Order training deleted')
    dispatch({
      type: DELETE_ORDER[SUCCESS],
      data: {
        trainingId
      }
    })
  } catch (error) {
    dispatch({ type: DELETE_ORDER[FAILURE], error })
  }
}

export const updateCourse = ({
  courseId,
  data,
  fullUpdate = false
}) => async dispatch => {
  dispatch({ type: UPDATE[REQUEST] })
  try {
    let response = await updateSchoolCourse(courseId, data, fullUpdate)
    notificationActions.dispatchSuccess(dispatch, 'Course saved')
    dispatch({
      type: UPDATE[SUCCESS],
      data: { course: response }
    })
    dispatch(loadMonthDay(data.date))
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to save Course')
    dispatch({ type: UPDATE[FAILURE], error })
  }
}

export const createCourse = ({ schoolId, data }) => async dispatch => {
  dispatch({ type: CREATE[REQUEST] })
  try {
    let response = await createSchoolCourse(schoolId, data)
    notificationActions.dispatchSuccess(dispatch, 'Course added')
    dispatch({
      type: CREATE[SUCCESS],
      data: { course: response }
    })
    dispatch(loadMonthDay(data.date))
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to add Course')
    dispatch({ type: CREATE[FAILURE], error })
  }
}

export const createBulkCourse = ({ schoolId, data }) => async dispatch => {
  dispatch({ type: CREATE_BULK[REQUEST] })
  try {
    dispatch(resetLoadedMonths())
    await createBulkSchoolCourse(schoolId, data)
    notificationActions.dispatchSuccess(dispatch, 'Bulk Courses added')
    dispatch({
      type: CREATE_BULK[SUCCESS]
    })
  } catch (error) {
    notificationActions.dispatchError(dispatch, 'Failed to add Bulk Courses')
    dispatch({ type: CREATE_BULK[FAILURE], error })
  }
}

export const fetchPrice = ({
  schoolId,
  course_type,
  datetime
}) => async dispatch => {
  dispatch({
    type: FETCH_PRICE[REQUEST],
    data: { schoolId, course_type, datetime }
  })
  try {
    let response = await getPricingForCourse(schoolId, course_type, datetime)
    dispatch({
      type: FETCH_PRICE[SUCCESS],
      data: response
    })
  } catch (error) {
    dispatch({ type: FETCH_PRICE[FAILURE], error })
  }
}

export const resetPrice = data => async dispatch => {
  dispatch({ type: RESET_PRICE })
}

const defaultState = {
  single: {
    course: null,
    loading: false,
    deleting: false,
    saving: false,
    error: null
  },
  day: {
    courses: [],
    loading: false,
    date: null,
    error: null
  },
  days: {
    courses: [],
    loading: false,
    error: null
  },
  pricing: {
    info: null,
    course_type: null,
    loading: false,
    schoolId: null,
    datetime: null
  },
  calendar: {
    courses: [],
    loading: false,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    error: null,
    viewMode: CALENDAR_VIEW.MONTH,
    rightPanelMode: null,
    selectedDate: null,
    selectedCourse: null,
    silent: false, // This is to tell whether should re-load calendar. false: re-load, true: not reload
    loadedMonths: []
  },
  orderEditForm: {
    order: null,
    loading: false
  },
  bulk: {
    saving: false,
    error: null
  },
  times: {
    available: [],
    loading: false,
    error: null
  },
  coursePackage: {
    courses: [],
    adding: false,
    editing: false
  }
}

const initialState = {
  ...JSON.parse(JSON.stringify(defaultState))
}

export default function reducer(state = initialState, action) {
  let dayCourses
  let calendarCourses
  switch (action.type) {
    case CANCEL_PACKAGE: {
      return {
        ...state,
        coursePackage: {
          courses: [],
          adding: false,
          editing: false
        }
      }
    }
    case ADD_PACKAGE: {
      return {
        ...state,
        coursePackage: {
          ...state.coursePackage,
          courses: [action.data],
          adding: true
        }
      }
    }
    case ADD_COURSE_TO_PACKAGE: {
      const courses = state.coursePackage.courses
        .filter(x => x.id !== action.data.id)
        .slice()
      courses.push(action.data)

      return {
        ...state,
        coursePackage: {
          ...state.coursePackage,
          courses
        }
      }
    }
    case REMOVE_COURSE_FROM_PACKAGE: {
      const courses = state.coursePackage.courses
        .filter(x => x.id !== action.data.id)
        .slice()

      return {
        ...state,
        coursePackage: {
          ...state.coursePackage,
          courses
        }
      }
    }
    case FETCH_SINGLE[REQUEST]:
      if (action.reset) {
        return {
          ...state,
          single: { loading: true, course: null, error: null }
        }
      }
      return {
        ...state,
        single: { ...state.single, loading: true }
      }
    case FETCH_SINGLE[SUCCESS]:
      dayCourses = state.day.courses.map(course =>
        course.id !== action.data.course.id ? course : { ...action.data.course }
      )
      calendarCourses = state.calendar.courses.map(course =>
        course.id !== action.data.course.id ? course : { ...action.data.course }
      )
      return {
        ...state,
        single: { loading: false, course: action.data.course, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: {
          ...state.calendar,
          courses: calendarCourses,
          selectedDate: action.data.course.date,
          selectedCourse: `course-${action.data.course.id}`
        }
      }
    case FETCH_SINGLE[FAILURE]:
      return {
        ...state,
        single: {
          loading: false,
          course: null,
          error: action.error,
          selectedCourse: null
        }
      }
    case FETCH_SINGLE_EVENT[SUCCESS]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          selectedCourse: `event-${action.data.event.id}`
        }
      }
    case DELETE[REQUEST]:
      return {
        ...state,
        single: { ...state.single, loading: true, deleting: true }
      }
    case DELETE[SUCCESS]:
      dayCourses = state.day.courses.filter(
        course => course.id !== action.data.courseId
      )
      calendarCourses = state.calendar.courses.filter(
        course => course.id !== action.data.courseId
      )
      return {
        ...state,
        single: { loading: false, deleting: false, course: null, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
      }

    case DELETE[FAILURE]:
      return {
        ...state,
        single: { loading: false, deleting: false }
      }

    case FETCH_FOR_DAY[REQUEST]: {
      const tmp = moment(action.date, 'YYYY-MM-DD')
      return {
        ...state,
        day: {
          courses: [],
          date: action.date,
          loading: true
        },
        calendar: {
          ...state.calendar,
          selectedDate: action.date,
          year: tmp.year(),
          month: tmp.month(),
          day: tmp.date(),
          silent: state.calendar.month === tmp.month()
        }
      }
    }
    case FETCH_FOR_DAY[SUCCESS]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          courses: [...action.data.courses],
          error: null
        }
      }
    case FETCH_FOR_DAY[FAILURE]:
      return {
        ...state,
        day: {
          ...state.day,
          loading: false,
          error: action.error
        }
      }
    case FETCH_TIMES[REQUEST]:
      return {
        ...state,
        times: {
          available: [],
          loading: true
        }
      }
    case FETCH_TIMES[SUCCESS]:
      const { defaultTime } = action.data
      const { times } = action.data
      const available =
        defaultTime && !times.some(t => t.time === defaultTime)
          ? [...times, { time: defaultTime }]
          : [...times]
      const sortedAvailable = available.sort((a, b) =>
        a.time > b.time ? 1 : b.time > a.time ? -1 : 0
      )

      return {
        ...state,
        times: {
          ...state.times,
          loading: false,
          available: sortedAvailable,
          errror: null
        }
      }
    case FETCH_TIMES[FAILURE]:
      return {
        ...state,
        times: {
          ...state.times,
          loading: false,
          error: action.error
        }
      }
    case UPDATE_CALENDAR_SETTING:
      const [key] = Object.entries(action.data)[0]

      if (key === 'viewMode') {
        saveState({
          course: {
            ...initialState,
            calendar: {
              ...initialState.calendar,
              ...action.data
            }
          }
        })
      }

      return {
        ...state,
        calendar: {
          ...state.calendar,
          ...action.data,
          silent: false
        }
      }
    case FETCH_FOR_FORM[REQUEST]:
      return {
        ...state,
        days: {
          courses: [],
          loading: true
        }
      }
    case FETCH_FOR_FORM[SUCCESS]:
      return {
        ...state,
        days: {
          loading: false,
          courses: [...action.data.courses]
        }
      }
    case FETCH_FOR_FORM[FAILURE]:
      return {
        ...state,
        days: {
          loading: false,
          courses: [],
          error: action.error
        }
      }
    case FETCH_ALL[REQUEST]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: true
        }
      }
    case FETCH_ALL[SUCCESS]:
      if (action.data.reset) {
        return {
          ...state,
          calendar: {
            ...state.calendar,
            loading: false,
            courses: [...action.data.courses],
            error: null,
            loadedMonths: [action.data.month]
          }
        }
      }

      let { courses } = state.calendar
      action.data.courses.forEach(x => {
        const tmp = courses.find(c => c.id === x.id)
        if (tmp) {
          Object.assign(tmp, x)
        } else {
          courses.push(x)
        }
      })

      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          courses,
          error: null,
          loadedMonths: [...state.calendar.loadedMonths, action.data.month]
        }
      }
    case FETCH_ALL[FAILURE]:
      return {
        ...state,
        calendar: {
          ...state.calendar,
          loading: false,
          error: action.error
        }
      }
    case CREATE_ORDER[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case CREATE_ORDER[SUCCESS]:
      return {
        ...state,
        single: { ...state.single, saving: false }
      }
    case CREATE_ORDER[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case UPDATE_DEFAULT_BIKES[REQUEST]: {
      return state
    }
    case UPDATE_DEFAULT_BIKES[SUCCESS]: {
      return state
    }
    case UPDATE_DEFAULT_BIKES[FAILURE]: {
      return state
    }
    case CREATE_PAYMENT[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case CREATE_PAYMENT[SUCCESS]:
      return {
        ...state,
        single: { ...state.single, saving: false }
      }
    case CREATE_PAYMENT[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case DELETE_ORDER[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case DELETE_ORDER[SUCCESS]:
      dayCourses = state.day.courses.map(course => {
        const newOrders = course.orders.filter(
          order => order.id !== action.data.trainingId
        )
        return { ...course, orders: newOrders }
      })
      return {
        ...state,
        single: { ...state.single, saving: false },
        day: { ...state.day, courses: dayCourses }
      }
    case DELETE_ORDER[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case CREATE_BULK[REQUEST]:
      return {
        ...state,
        bulk: { ...state.bulk, saving: true }
      }
    case CREATE_BULK[SUCCESS]:
      return {
        ...state,
        bulk: { ...state.bulk, saving: false },
        calendar: {
          ...state.calendar,
          loadedMonths: []
        }
      }
    case CREATE_BULK[FAILURE]:
      return {
        ...state,
        bulk: { ...state.bulk, saving: false, error: action.error }
      }
    case UPDATE[REQUEST]:
      return {
        ...state,
        single: { ...state.single, saving: true, error: null }
      }
    case UPDATE[SUCCESS]:
      dayCourses = state.day.courses.map(course =>
        course.id !== action.data.course.id ? course : { ...action.data.course }
      )
      calendarCourses = state.calendar.courses.map(course =>
        course.id !== action.data.course.id ? course : { ...action.data.course }
      )
      return {
        ...state,
        single: { saving: false, course: action.data.course, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
      }
    case UPDATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case CREATE[REQUEST]:
      return {
        ...state,
        single: { course: null, saving: true, error: null }
      }
    case CREATE[SUCCESS]:
      dayCourses =
        action.data.course.date === state.day.date
          ? [action.data.course, ...state.day.courses]
          : state.day.courses
      calendarCourses = [action.data.course, ...state.calendar.courses]
      return {
        ...state,
        single: { saving: false, course: action.data.course, error: null },
        day: { ...state.day, courses: dayCourses },
        calendar: { ...state.calendar, courses: calendarCourses }
      }
    case CREATE[FAILURE]:
      return {
        ...state,
        single: { ...state.single, saving: false, error: action.error }
      }
    case SHIFT_DELETED: {
      const calendarCourses = state.calendar.courses.slice()
      action.data.courses.forEach(course => {
        const tmp2 = calendarCourses.find(x => x.id === course.id)
        if (tmp2) {
          Object.assign(tmp2, course)
        }
      })

      return {
        ...state,
        calendar: { ...state.calendar, courses: calendarCourses }
      }
    }
    case UNSET_DAY:
      return {
        ...state,
        calendar: { ...state.calendar, selectedDate: null }
      }
    case UNSET_SELECTED_COURSE:
      return {
        ...state,
        calendar: { ...state.calendar, selectedCourse: null }
      }
    case RESET_PRICE:
      return {
        ...state,
        pricing: {
          info: null,
          course_type: null,
          loading: false,
          schoolId: null,
          datetime: null
        }
      }
    case FETCH_PRICE[REQUEST]:
      return {
        ...state,
        pricing: { ...action.data, loading: true, info: null }
      }
    case FETCH_PRICE[SUCCESS]:
      return {
        ...state,
        pricing: { ...state.pricing, loading: false, info: action.data }
      }
    case FETCH_PRICE[FAILURE]:
      return {
        ...state,
        pricing: { ...state.pricing, loading: false }
      }
    case FETCH_ORDER[REQUEST]:
      return {
        ...state,
        orderEditForm: { order: null, loading: true, error: null }
      }
    case FETCH_ORDER[SUCCESS]:
      return {
        ...state,
        orderEditForm: { order: action.data.order, loading: false, error: null }
      }
    case FETCH_ORDER[FAILURE]:
      return {
        ...state,
        orderEditForm: {
          ...state.orderEditForm,
          loading: false,
          error: action.error
        }
      }
    case UPDATE_ORDER[REQUEST]:
      return {
        ...state,
        orderEditForm: { ...state.orderEditForm, loading: true, error: null }
      }
    case UPDATE_ORDER[SUCCESS]:
      return {
        ...state,
        orderEditForm: { order: action.data.order, loading: false, error: null }
      }
    case UPDATE_ORDER[FAILURE]:
      return {
        ...state,
        orderEditForm: {
          ...state.orderEditForm,
          loading: false,
          error: action.error
        }
      }
    case RESET_DATA: {
      return {
        ...JSON.parse(JSON.stringify(defaultState))
      }
    }
    default:
      return state
  }
}
