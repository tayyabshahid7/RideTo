import calculator from './images/calculator.svg'
import instructor from './images/instructor.svg'
import quote from './images/quote.svg'
import revise from './images/revise.svg'

export const STEP_START = {
  name: 'Start',
  status: 'Start',
  id: 'STEP_START'
}

export const STEP_LICENCE = {
  name: 'Licence',
  title: 'Licence',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  faqs: {
    "What's included?": '',
    'What do I need to bring?': '',
    'What happens next?': '',
    'Is my payment secure?': '',
    'Can I pay in cash?': ''
  },
  form: {
    icon: calculator,
    href: '/',
    buttonText: 'Open licence calculator'
  },
  status: 'Next Step',
  id: 'STEP_LICENCE'
}

export const STEP_ITM = {
  name: 'ITM',
  title: 'Introduction to motorcycling',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  faqs: {
    "What's included?": '',
    'What do I need to bring?': '',
    'What happens next?': '',
    'Is my payment secure?': '',
    'Can I pay in cash?': ''
  },
  cta: {
    href: '/',
    text: 'About the course'
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/',
    buttonText: 'Book ITM course'
  },
  status: 'Not Started',
  id: 'STEP_ITM'
}

export const STEP_REVISE = {
  name: 'Revise',
  title: 'Revision',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Revision guides',
    items: [
      { title: 'What to Prepare For Your CBT Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  form: {
    icon: revise,
    href: '/',
    buttonText: 'Start revision'
  },
  status: 'Not Started',
  id: 'STEP_REVISE'
}

export const STEP_CBT_BEFORE = {
  name: 'CBT',
  title: 'CBT',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  included: {
    title: 'What you need',
    items: [
      'Bike & helmet hire',
      'Test fees & fuel',
      'Online pre-training',
      'Free cancellation',
      '135 training locations UK wide',
      'Dedicated support team'
    ]
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/',
    buttonText: 'Book CBT course'
  },
  status: 'Not Started',
  id: 'STEP_CBT_BEFORE'
}

export const STEP_CBT_BOOKED = {
  name: 'CBT',
  title: 'CBT',
  course: true,
  included: {
    title: "What's included",
    items: [
      'Bike & helmet hire',
      'Test fees & fuel',
      'Online pre-training',
      'Free cancellation',
      '135 training locations UK wide',
      'Dedicated support team'
    ]
  },
  guides: {
    title: 'Useful guides',
    items: [
      { title: 'What to Prepare For Your CBT Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  status: 'Not Started',
  id: 'STEP_CBT_BOOKED'
}

export const STEP_CBT_POST = {
  name: 'CBT',
  title: 'Post CBT',
  feedBack: true,
  status: 'Not Started',
  id: 'STEP_CBT_POST'
}

export const STEP_THEORY_TEST = {
  name: 'Theory test',
  title: 'Theory test',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Revision guides',
    items: [
      { title: 'What to Prepare For Your CBT Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  form: {
    icon: revise,
    href: '/',
    buttonText: 'Book theory test'
  },
  status: 'Not Started',
  id: 'STEP_THEORY_TEST'
}

export const STEP_FULL_LICENCE_BEFORE = {
  name: 'Full Licence',
  title: 'Full Licence',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  included: {
    title: 'What you need',
    items: [
      'Bike & helmet hire',
      'Test fees & fuel',
      'Online pre-training',
      'Free cancellation',
      '135 training locations UK wide',
      'Dedicated support team'
    ]
  },
  cta: {
    href: '/',
    text: 'About the course'
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/',
    buttonText: 'Book local instructor'
  },
  status: 'Not Started',
  id: 'STEP_FULL_LICENCE_BEFORE'
}

export const STEP_FULL_LICENCE_BOOKED = {
  name: 'Full Licence',
  title: 'Full Licence',
  course: true,
  included: {
    title: 'What you need',
    items: [
      'Bike & helmet hire',
      'Test fees & fuel',
      'Online pre-training',
      'Free cancellation',
      '135 training locations UK wide',
      'Dedicated support team'
    ]
  },
  guides: {
    title: 'Revision guides',
    items: [
      { title: 'What to Prepare For Your Full Licence Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  status: 'Not Started',
  id: 'STEP_FULL_LICENCE_BOOKED'
}

export const STEP_FULL_LICENCE_POST = {
  name: 'Full Licence',
  title: 'Post Full Licence',
  feedBack: true,
  id: 'STEP_FULL_LICENCE_POST',
  status: 'Not Started'
}

export const STEP_GEAR = {
  name: 'Gear',
  title: 'Gear',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Advice',
    items: [
      { title: 'Best Helmets for Beginners', url: '/' },
      { title: 'Best Gloves for Beginners', url: '/' },
      { title: 'What Bike to Buy', url: '/' },
      { title: 'Best Helmets for Beginners', url: '/' },
      { title: 'Best Gloves for Beginners', url: '/' },
      { title: 'What Bike to Buy', url: '/' }
    ]
  },
  gear: [
    {
      name: 'Gear 1',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Gear 2',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Gear 3',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Gear 4',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    }
  ],
  status: 'Not Started',
  id: 'STEP_GEAR'
}

export const STEP_BIKE = {
  name: 'Bike',
  title: 'Bike',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Advice',
    items: [{ title: 'Best Bikes for Beginners', url: '/' }]
  },
  gear: [
    {
      name: 'Bike 1',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Bike 2',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Bike 3',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    },
    {
      name: 'Bike 4',
      link: '/',
      image: 'https://via.placeholder.com/120x62'
    }
  ],
  status: 'Not Started',
  id: 'STEP_BIKE'
}

export const STEP_INSURE = {
  name: 'Insurance',
  title: 'Insurance',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Revision guides',
    items: [
      { title: 'What to Prepare For Your CBT Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  form: {
    icon: quote,
    href: '/',
    buttonText: 'Get a quote'
  },
  status: 'Not Started',
  id: 'STEP_INSURE'
}

export const STEP_RIDE = {
  name: 'Ride',
  status: 'Ride',
  id: 'STEP_RIDE'
}

const NEXT_STEPS = [
  STEP_START,
  STEP_LICENCE,
  STEP_ITM,
  STEP_REVISE,
  STEP_CBT_BEFORE,
  STEP_CBT_BOOKED,
  STEP_CBT_POST,
  STEP_THEORY_TEST,
  STEP_FULL_LICENCE_BEFORE,
  STEP_FULL_LICENCE_BOOKED,
  STEP_FULL_LICENCE_POST,
  STEP_GEAR,
  STEP_BIKE,
  STEP_INSURE,
  STEP_RIDE
]

export default NEXT_STEPS
