const FULL_LICENCE_FAQS = {
  howMuchTraining:
    "This depends heavily on your riding experience. It's best to call us on 0203 603 9652 to chat with our friendly team about what package is right for you.",
  howFarAdvance:
    'Full licence classes have a very restricted number of places in each course. Due to extremely popular demand, you should aim to book at least 2 weeks in advance in order to get a convenient date.',
  canIJustBook:
    'You can with the government, however there are issues with having the correct bike and learning the required skills. Being professionally taught to ride is vital in becoming a safe rider and successfully gaining your licence.',
  iveCompleted:
    'Yes we can, call our team on 0203 603 9652 to discuss Module 2 availability.',
  whatSize:
    "This very much depends on how old you are. Read our 'What Can I Ride' section."
}

const data = [
  {
    name: 'Get a licence',
    img: 'https://via.placeholder.com/350x150',
    title:
      "We'll help you get the right training and licence for your riding ambitions",
    text:
      "Riding is a unique community of some of the most diverse, interesting and awesome people you can meet. We're passionate about cultivating this for new riders and regularly organise events, meetups and ride outs. No matter what you ride, get involved.",
    links: [
      { url: '/', text: 'Join the community' },
      { url: '/', text: 'Shop gear', alt: true }
    ],
    faqs: FULL_LICENCE_FAQS
  }
]

// export default data
export default [...data, ...data, ...data, ...data].map((data, i) => ({
  ...data,
  name: `${data.name} ${i}`
}))
