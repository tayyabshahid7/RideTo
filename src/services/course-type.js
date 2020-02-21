import { get } from 'services/api'

export const fetchCoursesTypes = async postCode => {
  const path = `course-types`
  const params = {
    postcode: postCode
  }

  return await get(path, params, false)
}

export const fetchSearchForLocationRequests = async params => {
  const path = `courses-new/`
  return await get(path, params, false)
}

export const getFilters = () => {
  return [
    { tag: 'ALL', name: 'All' },
    { tag: 'BEGINNER', name: 'Beginner' },
    { tag: 'ADVANCED', name: 'Experienced' },
    { tag: 'CBT', name: 'CBT' },
    { tag: 'FULL', name: 'Full Licence' }
  ]
}

export const getFiltersTag = () => {
  return ['ALL', 'BEGINNER', 'ADVANCED', 'CBT', 'FULL']
}

export const getCourseFaqs = () => {
  return [
    {
      question:
        'Can I ride a manual motorcycle if I take my CBT on an automatic scooter?',
      answer: `Legally yes, the CBT isn't restricted to the specific bike type you train on. However we'd always recommend professional training before riding a completely new type of bike on the road.`
    },
    {
      question: `What should I do if I haven't ridden a motorcycle at all before?`,
      answer: `You will be taught thoroughly throughout your CBT (Compulsory Basic Training). However it is a good idea to get as much preparation in beforehand as you can. It's worth making sure you have a good idea of what you’ll have to do during your CBT, then get some practice in by trying out some of the exercises on a bicycle. It’s also worth having a brush up on your highway code too.`
    },
    {
      question: 'Do I need to take a theory test before my CBT?',
      answer: `In short, no. The CBT passes you as a learner for 2 years, you don’t need to pass a theory test. However you will have to pass one if you wish to progress to a full motorcycle licence.`
    },
    {
      question: 'What can I ride once I complete the CBT?',
      answer: `This will depend on your age. If you are 16 you will be restricted to a 50cc moped. If you are aged 17 or older you can ride a light motorcycle up to 125cc.`
    },
    {
      question: 'How long is the CBT valid for?',
      answer: `The CBT certificate is valid for 2 years. If you don't move on to a full licence you will have to complete a CBT every 2 years.`
    },
    {
      question: 'What can I ride if I have a full car licence?',
      answer: `If you passed your UK driving test before 1st February 2001, you can ride a 50cc moped without L plates, without the need to take a CBT. You can also take a pillion passenger. However if you want to ride a 125cc you will have to take the CBT.

If you passed your driving test after the 1st February 2001 a CBT will be required before you can ride any scooter or motorbike.`
    },
    {
      question:
        'I want to ride a large motorcycle without restrictions, what do I need to do?',
      answer: `Ultimately you will need a full (A) motorcycle licence.`
    },
    {
      question: 'Can I carry passengers after completing a CBT?',
      answer: `No. In order to carry a pillion passenger you need to get either an AM, A1, A2 or A licence by taking a theory and both modules of the practical motorcycle test.`
    },
    {
      question: 'Can I ride on motorways after taking my CBT?',
      answer: `No. You can only do this once you’ve attained your full licence.`
    },
    {
      question: 'Do I need to display L plates after passing the CBT?',
      answer: `Yes. Unless you have a full car licence issued before 1st February 2001 and your riding a 50cc moped.`
    },
    {
      question: 'Can you ride on a dual carriageway with a CBT licence?',
      answer: `Yes you can.`
    },
    {
      question: 'Can you fail the CBT?',
      answer: `It’s not technically a test, however an instructor will ask you to come back for additional training if they feel you require it.`
    }
  ]
}
