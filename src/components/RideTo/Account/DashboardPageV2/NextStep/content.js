export const NEXT_STEP_START = {
  name: 'Start',
  status: 'Start',
  id: 'NEXT_STEP_START'
}

export const NEXT_STEP_LICENCE = {
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
    icon: '',
    href: '/',
    buttonText: 'Open licence calculator'
  },
  status: 'Next Step',
  id: 'NEXT_STEP_LICENCE'
}

export const NEXT_STEP_ITM = {
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
  form: {
    icon: '',
    label: 'Postcode',
    action: '/',
    buttonText: 'Book ITM course'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_ITM'
}

export const NEXT_STEP_REVISE = {
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
    icon: '',
    href: '/',
    buttonText: 'Start revision'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_REVISE'
}

export const NEXT_STEP_CBT = {
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
    icon: '',
    label: 'Postcode',
    action: '/',
    buttonText: 'Book CBT course'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_CBT'
}

export const NEXT_STEP_CBT_BOOKED = {
  name: 'CBT',
  title: 'CBT',
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
      { title: 'What to Prepare For Your CBT Training?', url: '/' },
      { title: 'Motorcycle Controls and Overview', url: '/' },
      { title: 'Road Signs', url: '/' },
      { title: 'Roundabouts', url: '/' },
      { title: 'Traffic Lights', url: '/' },
      { title: 'Road Riding Theory and Safety', url: '/' }
    ]
  },
  status: 'Not Started',
  id: 'NEXT_STEP_CBT_BOOKED'
}

export const NEXT_STEP_POST_CBT = {
  name: 'CBT',
  title: 'Post CBT',
  feedBack: true,
  status: 'Not Started',
  id: 'NEXT_STEP_POST_CBT'
}

export const NEXT_STEP_THEORY_TEST = {
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
    icon: '',
    href: '/',
    buttonText: 'Book theory test'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_THEORY_TEST'
}

export const NEXT_STEP_FULL_LICENCE = {
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
  form: {
    icon: '',
    label: 'Postcode',
    action: '/',
    buttonText: 'Book Full Licence course'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_FULL_LICENCE'
}

export const NEXT_STEP_FULL_LICENCE_BOOKED = {
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
  id: 'NEXT_STEP_FULL_LICENCE_BOOKED'
}

export const NEXT_STEP_POST_FULL_LICENCE = {
  name: 'Full Licence',
  title: 'Post Full Licence',
  feedBack: true,
  id: 'NEXT_STEP_POST_FULL_LICENCE',
  status: 'Not Started'
}

export const NEXT_STEP_GEAR = {
  name: 'Gear',
  title: 'Gear',
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
  id: 'NEXT_STEP_GEAR'
}

export const NEXT_STEP_BIKE = {
  name: 'Bike',
  title: 'Bike',
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
  id: 'NEXT_STEP_BIKE'
}

export const NEXT_STEP_INSURANCE = {
  name: 'Insurance',
  title: 'Insurance',
  introduction: {
    title: 'Introduction',
    text:
      "The choice of bikes available now is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride."
  },
  guides: {
    title: 'Insurance guides',
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
    icon: '',
    href: '/',
    buttonText: 'Get a quote'
  },
  status: 'Not Started',
  id: 'NEXT_STEP_INSURANCE'
}

export const NEXT_STEP_RIDE = {
  name: 'Ride',
  status: 'Ride',
  id: 'NEXT_STEP_RIDE'
}

const NEXT_STEPS = [
  NEXT_STEP_START,
  NEXT_STEP_LICENCE,
  NEXT_STEP_ITM,
  NEXT_STEP_REVISE,
  NEXT_STEP_CBT,
  NEXT_STEP_CBT_BOOKED,
  NEXT_STEP_POST_CBT,
  NEXT_STEP_THEORY_TEST,
  NEXT_STEP_FULL_LICENCE,
  // NEXT_STEP_FULL_LICENCE_BOOKED,
  // NEXT_STEP_POST_FULL_LICENCE,
  NEXT_STEP_GEAR,
  NEXT_STEP_BIKE,
  NEXT_STEP_INSURANCE,
  NEXT_STEP_RIDE
]

export default NEXT_STEPS
