const image1 =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-1.jpg'
const image2 =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-2.jpg'
const image3 =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-3.jpg'
const image4 =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-4.jpg'
const image5 =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/getting-started-5.jpg'

const GET_A_LICENCE = {
  name: 'Get a licence',
  img: image1,
  title: "We'll get you the right training for your riding ambitions",
  faqs: {
    whatLicenceDoYouNeed:
      "If you just want to ride around town on a small motorcycle or scooter, then a CBT licence is all you need. You can ride a bike up to 125cc (11Kw) but cannot take passengers or ride on motorways. If you want to ride anything larger, you'll need to carry on to pass the motorcycle theory test and complete 2 full motorcycle licence tests. ",
    whatIsACBTLicence:
      'The CBT stands for Compulsory Basic Training and is designed for anyone looking to ride a small scooter or motorcycle up to 125cc. It covers all the basics from handling a bike, road riding theory and the practical skills of riding. ',
    passingYourTheoryTest:
      "Once you have completed the CBT, you'll need to book a theory test online with the Government and pass the 2 part exam of multiple choice and hazard perception if you wish to take the full motorcycle licence exams.",
    gettingYourFullLicence:
      "Once you have your CBT and theory test certificates it's time to book in for a full motorcycle licence course. Depending on your experience this can usually be completed over 4 - 6 separate days of training including 2 tests. Give us a call to discuss the right package for you. "
  },
  links: [
    {
      url: 'https://rideto.typeform.com/to/XeXuVE',
      text: 'Licence calculator',
      typeform: true
    }
  ]
}

const GET_A_BIKE = {
  name: 'Get a bike',
  img: image2,
  title: 'So many bikes but which to choose?',
  text:
    "The choice of bikes available is immense. Whether you're looking for a city commuter, weekend cruiser or track day racer, our bike chooser will help you find and book a test ride with your dream machine.",
  links: [{ url: '/bike-reviews', text: 'See the bikes' }]
}

const GET_INSURED = {
  name: 'Get insured',
  img: image3,
  title: "We'll beat your best insurance quote guaranteed*",
  text:
    "The least exciting, but important part of riding is getting the right cover. We've partnered with The Bike Insurer to get you the best price guaranteed on your insurance. Click to get a quick quote and be on the road in no time. ",
  links: [
    { url: 'http://tidd.ly/a35e0aed', text: 'Get a quote', external: true }
  ]
}

const GET_THE_GEAR = {
  name: 'Get the gear',
  img: image4,
  title: 'Get the look, be protected.',
  text:
    "Our clothing partners SportsBikeShop bring you the biggest selection of riding gear. From helmets to gloves and boots. Get kitted out at the best price with the best gear. Unsure what's right for you? Check out our latest gear reviews. ",
  links: [
    { url: '/blog/gear-guide-for-new-motorcyclists', text: 'See Gear Reviews' },
    {
      url: 'https://www.sportsbikeshop.co.uk/#/23639,0,0',
      text: 'Shop Gear',
      external: true,
      alt: true
    }
  ]
}

const JOIN_THE_COMMUNITY = {
  name: 'Join the community',
  img: image5,
  title: 'Be part of something epic, make friends for life. ',
  text:
    "Riding is a unique community of some of the most diverse, interesting and awesome people you can meet. We're passionate about cultivating this for new riders and regularly organise events, meetups and ride outs. No matter what you ride, get involved. ",
  links: [
    {
      url: 'https://www.facebook.com/groups/newmotorcyclists/',
      text: 'Join the community ',
      external: true
    }
  ]
}

const data = [
  GET_A_LICENCE,
  GET_A_BIKE,
  GET_INSURED,
  GET_THE_GEAR,
  JOIN_THE_COMMUNITY
]

export default data
