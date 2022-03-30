import calculator from './images/calculator.svg'
import instructor from './images/instructor.svg'
import quote from './images/quote.svg'
import revise from './images/revise.svg'
import finish from './images/finish.svg'

const boots =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/boots.d137b94c.jpg'
const gloves =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/gloves.7be989ec.jpg'
const helmets =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/helmets.6a4fbdb6.jpg'
const jackets =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/jackets.64cfde3b.jpg'
const jeans =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/jeans.37322ea1.jpg'
const locks =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/locks.03d39d75.jpg'
const luggage =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/luggage.1e304f60.jpg'

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
      'The first thing you need to get started is the right licence. To ride a scooter or motorcycle you need at least a UK Provisional or Driving Licence. Or an EU Licence with a UK licence counterpart number.'
  },
  faqs: {
    'I have an EU licence, what do I need?':
      "You'll need to complete a D91 form with the government to get a UK counterpart licence number OR apply for a UK Provisional/Driving Licence.",
    "I don't have a licence/ I have non-EU licence, what do I need?":
      'You\'ll need to apply for a UK Provisional licence with the government <a href="https://www.gov.uk/apply-first-provisional-driving-licence" target="_blank" rel="noopener noreferrer">here</a>.',
    'How do I pass the CBT test?':
      "A common misunderstanding - there is no CBT test, it's a training course, which the 5 elements need to be completed in order to gain the certificate. Therefore, if you want a CBT ‘licence', book the CBT training.",
    'What is the ITM course? Do I need to take it?':
      'The Introduction to motorcycling course is the perfect first session for complete beginners to spend time on a motorcycle with an instructor, learning the core basics of riding. It is not mandatory but recommended for new riders, especially those planning to ride manual motorcycles for the first time.'
  },
  form: {
    icon: calculator,
    href: 'https://rideto.typeform.com/to/Oz2Xj6wN',
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
      'The Introduction To Motorcycling (ITM) course is a 2 hour beginners course, to give new riders experience before the CBT:',
    list: [
      'Focus on the core skills and controls of riding a motorcycle',
      'Experience the fun and freedom before committing to the CBT course',
      'Learn the basics of clutch and gear controls'
    ]
  },
  faqs: {
    'Do I need to take an ITM?':
      "If you've never ridden a motorcycle or scooter before and your expectation is to complete your CBT within 1 day, we'd recommend considering the ITM course first.",
    'What will I do during the ITM?':
      "The ITM is tailored to your needs. You'll focus all the time on bike control and handling, getting to grips with balancing, stopping, starting and turning.",
    'How far in advance should I book?':
      'ITM classes have a restricted number of places in each course. Due to the popular demand, you should aim to book at least 1 - 2  weeks in advance in order to get a convenient date.',
    "I can't see any Introduction courses in my area?":
      "Not all of our instructors have their introduction courses live online. If you can't find a local ITM course to you, give us a call and we can arrange something for you."
  },
  cta: {
    href: '/introduction-to-motorcycling',
    text: 'About the course'
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/course-location',
    params: {
      courseType: 'INTRO_TO_MOTORCYCLING'
    },
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
      "The CBT course contains 5 parts including 3 theory sections, so it's important that you have a good understanding of the Highway Code and motorcycling basics before. Get ready with our handy online guides."
  },
  guides: {
    title: 'Revision guides',
    items: [
      {
        title: 'What to Prepare For Your CBT Training?',
        url: 'https://www.rideto.com/blog/prepare-for-cbt-training'
      },
      {
        title: 'Motorcycle Controls and Overview',
        url: 'https://www.rideto.com/blog/motorcycle-controls'
      },
      { title: 'Road Signs', url: 'https://www.rideto.com/blog/road-signs' },
      { title: 'Roundabouts', url: 'https://www.rideto.com/blog/roundabouts' },
      {
        title: 'Traffic Lights',
        url: 'https://www.rideto.com/blog/traffic-lights'
      },
      {
        title: 'Road Riding Theory and Safety',
        url: 'https://www.rideto.com/blog/Road-Riding-Theory-and-Safety'
      }
    ]
  },
  form: {
    icon: revise,
    href: 'https://www.rideto.com/blog/prepare-for-cbt-training',
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
      'A 1 day course designed to prepare new riders to ride up to a 125cc motorcycle or scooter.',
    list: [
      'Ride on dual carriageways',
      'You cannot ride on motorways or take passengers',
      'You must display L plates',
      'Valid for 2 years'
    ]
  },
  included: {
    title: "What's included",
    items: [
      'Bike & helmet hire',
      'Test fees & fuel',
      'Online pre-training',
      'Flexible cancellation',
      '135 training locations UK wide',
      'Dedicated support team'
    ],
    type: 'cbt'
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/course-location',
    params: {
      courseType: 'LICENCE_CBT'
    },
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
      'Bike hire and fuel',
      'Helmet provided',
      'Gloves & jacket provided'
    ],
    type: 'cbt'
  },
  guides: {
    title: 'Useful guides',
    items: [
      {
        title: 'What to Prepare For Your CBT Training?',
        url: 'https://www.rideto.com/blog/prepare-for-cbt-training'
      },
      {
        title: 'Motorcycle Controls and Overview',
        url: 'https://www.rideto.com/blog/motorcycle-controls'
      },
      { title: 'Road Signs', url: 'https://www.rideto.com/blog/road-signs' },
      { title: 'Roundabouts', url: 'https://www.rideto.com/blog/roundabouts' },
      {
        title: 'Traffic Lights',
        url: 'https://www.rideto.com/blog/traffic-lights'
      },
      {
        title: 'Road Riding Theory and Safety',
        url: 'https://www.rideto.com/blog/Road-Riding-Theory-and-Safety'
      }
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
      'Once you’ve completed the CBT, there’s one more certificate you need to get before you can get started with training for the ultimate freedom of a full motorcycle licence. The motorcycle theory test is the same format as the car theory, containing a multiple choice section of 50 questions and a hazard perception test of 14 videos. The test is booked online directly at the .Gov website.'
  },
  guides: {
    title: 'Revision guides',
    items: [
      {
        title: '​Motorcycle Theory Test - What’s Involved',
        url:
          'https://www.rideto.com/blog/motorcycle-theory-and-hazard-perception-tests'
      },
      {
        title: 'Road Riding Theory and Safety',
        url: 'https://www.rideto.com/blog/Road-Riding-Theory-and-Safety'
      },
      { title: 'Road Signs', url: 'https://www.rideto.com/blog/road-signs' },
      {
        title: '5 Step Guide to Getting Your Motorcycle Licence',
        url:
          'https://www.rideto.com/blog/5-Steps-to-Getting-Your-Motorcycle-Licence'
      }
    ]
  },
  form: {
    icon: revise,
    href: 'https://www.gov.uk/book-theory-test',
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
      'Want to carry passengers, ride a bigger bike and get rid of the L Plates? It’s time to get your full motorcycle licence! This multi-day course will teach you to ride and pass the 2 tests on the right bike for the licence you wish to obtain. Either an A1, A2 or A (unrestricted) licence depending on your age and the bike you take the tests on.'
  },
  included: {
    title: "What's included",
    items: [
      'Bike hire and fuel',
      'Helmet, gloves and jacket',
      'Test fees and escort to and from test centres',
      '12 working day free cancellation'
    ],
    type: 'das'
  },
  cta: {
    href: '/motorcycle-licence',
    text: 'About the course'
  },
  form: {
    icon: instructor,
    label: 'Postcode',
    action: '/course-location',
    params: {
      courseType: 'FULL_LICENCE'
    },
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
    title: "What's included",
    items: [
      'Bike hire and fuel',
      'Helmet, gloves and jacket',
      'Test fees and escort to and from test centres',
      '12 working day free cancellation'
    ],
    type: 'das'
  },
  guides: {
    title: 'Revision guides',
    items: [
      { title: 'What to Prepare For Your Full Licence Training?', url: '/' },
      {
        title: 'Motorcycle Controls and Overview',
        url: 'https://www.rideto.com/blog/motorcycle-controls'
      },
      { title: 'Road Signs', url: 'https://www.rideto.com/blog/road-signs' },
      { title: 'Roundabouts', url: 'https://www.rideto.com/blog/roundabouts' },
      {
        title: 'Traffic Lights',
        url: 'https://www.rideto.com/blog/traffic-lights'
      },
      {
        title: 'Road Riding Theory and Safety',
        url: 'https://www.rideto.com/blog/Road-Riding-Theory-and-Safety'
      }
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
  guides: {
    title: 'Advice',
    items: [
      {
        title: 'Essential Guide To Gear for New Motorcyclists',
        url: 'https://www.rideto.com/blog/gear-guide-for-new-motorcyclists'
      },
      {
        title: '5 Step Guide to Buying a Motorcycle Helmet',
        url:
          'https://www.rideto.com/blog/5-tips-when-buying-a-motorcycle-helmet'
      },
      {
        title: '​Which Type of Motorcycle Denim is Best?',
        url: 'https://www.rideto.com/blog/which-motorcycle-denim-is-best'
      }
    ]
  },
  gear: [
    {
      name: 'Helmets',
      image: helmets,
      link: 'https://store.rideto.com/collections/motorcycle-helmets'
    },
    {
      name: 'Gloves',
      image: gloves,
      link: 'https://store.rideto.com/collections/motorcycle-gloves'
    },
    {
      name: 'Jackets',
      image: jackets,
      link: 'https://store.rideto.com/collections/motorcycle-jackets'
    },
    {
      name: 'Jeans',
      image: jeans,
      link: 'https://store.rideto.com/collections/motorcyle-jeans'
    },
    {
      name: 'Boots',
      image: boots,
      link: 'https://store.rideto.com/collections/boots'
    },
    {
      name: 'Locks',
      image: locks,
      link: 'https://store.rideto.com/collections/security'
    },
    {
      name: 'Luggage',
      image: luggage,
      link: 'https://store.rideto.com/collections/accessory'
    }
  ],
  bottomForm: {
    icon: revise,
    href: 'https://store.rideto.com',
    buttonText: 'Shop Motorcycle Gear'
  },
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
  gear: true,
  status: 'Not Started',
  id: 'STEP_BIKE'
}

export const STEP_INSURE = {
  name: 'Insurance',
  title: 'Insurance',
  introduction: {
    title: 'Description',
    text:
      'Insurance is a legal requirement for every bike and rider on the road. Every insurance policy is unique to the individual, get a quick quote and the best price guaranteed with our Insurance Partner The Biker Insurer.'
  },
  guides: {
    title: 'Advice',
    items: [
      {
        title: '10 Things to Consider Before Buying Motorcycle Insurance',
        url:
          'https://www.rideto.com/blog/10-things-to-consider-before-buying-motorcycle-insurance'
      },
      {
        title: 'Top Tips to Keeping Your Motorcycle Safe',
        url:
          'https://www.rideto.com/blog/top-tips-to-keeping-your-motorcycle-safe'
      },
      {
        title: 'How Much Does It Cost To Ride A Motorcycle?',
        url:
          'https://www.rideto.com/blog/how-much-does-it-cost-to-ride-a-motorcycle'
      },
      {
        title: 'Safety Tips for New Motorcycle Riders',
        url: 'https://www.rideto.com/blog/safety-tips-for-new-motorcycle-riders'
      }
    ]
  },
  form: {
    icon: quote,
    href: 'http://tidd.ly/a35e0aed',
    text: 'Best Insurance Price Guaranteed!',
    buttonText: 'Get a quote'
  },
  status: 'Not Started',
  id: 'STEP_INSURE'
}

export const STEP_RIDE = {
  name: 'Ride',
  title: 'Ride!',
  status: 'Ride',
  id: 'STEP_RIDE',
  introduction: {
    title: 'Introduction',
    text:
      'Congratulations!!! You made it! Riding a bike is like nothing else. The fun, freedom and community of two wheels is unique and we’re psyched you’ve become apart of it with RideTo. Now it’s all about making the most of your bike. Join our <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/groups/newmotorcyclists/?ref=bookmarks">Facebook group</a> to get involved with the community and check back soon for the latest ride outs and events.'
  },
  guides: {
    title: 'Advice',
    items: [
      {
        title: 'Top 5 Mistakes That New Motorcyclists Make',
        url:
          'https://www.rideto.com/blog/top-five-mistakes-new-motorcyclists-make'
      },
      {
        title: 'Top Motorcycle Rides 2019',
        url: 'https://www.rideto.com/blog/top-motorcycle-rides-uk-2019'
      },
      {
        title: 'Top Motorcycle Festivals In 2019',
        url: 'https://www.rideto.com/blog/top-motorcycle-festivals-2019'
      },
      {
        title: 'Motorcycle Day Trips From London',
        url: 'https://www.rideto.com/blog/motorcycle-day-trips-from-london'
      },
      {
        title: '​10 Instagram Accounts Every Biker Should Follow',
        url:
          'https://www.rideto.com/blog/10-instagram-accounts-every-biker-should-follow'
      },
      {
        title: 'Rider Stories - WHY we ride',
        url: 'https://www.rideto.com/blog/category/rider-stories'
      }
    ]
  },
  form: {
    icon: finish,
    href: 'https://www.facebook.com/groups/newmotorcyclists/?ref=bookmarks',
    buttonText: 'Join the community'
  }
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
