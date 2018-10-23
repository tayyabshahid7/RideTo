import { get } from 'services/api'

export const fetchCoursesTypes = async postCode => {
  const path = `course-types`
  const params = {
    postcode: postCode
  }

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
      question: 'What will I learn',
      answer: `Lorem ipsum dolor sit amet, 
      consectetur adipisicing elit, sed do eiusmod 
      tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation 
       ullamco laboris nisi ut aliquip ex ea commodo 
       consequat. Duis aute irure dolor in reprehenderit in 
       voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non 
       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
      question: 'What will I learn',
      answer: `Lorem ipsum dolor sit amet, 
      consectetur adipisicing elit, sed do eiusmod 
      tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation 
       ullamco laboris nisi ut aliquip ex ea commodo 
       consequat. Duis aute irure dolor in reprehenderit in 
       voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non 
       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
      question: 'What will I learn',
      answer: `Lorem ipsum dolor sit amet, 
      consectetur adipisicing elit, sed do eiusmod 
      tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation 
       ullamco laboris nisi ut aliquip ex ea commodo 
       consequat. Duis aute irure dolor in reprehenderit in 
       voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non 
       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
      question: 'What will I learn',
      answer: `Lorem ipsum dolor sit amet, 
      consectetur adipisicing elit, sed do eiusmod 
      tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation 
       ullamco laboris nisi ut aliquip ex ea commodo 
       consequat. Duis aute irure dolor in reprehenderit in 
       voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non 
       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    },
    {
      question: 'What will I learn',
      answer: `Lorem ipsum dolor sit amet, 
      consectetur adipisicing elit, sed do eiusmod 
      tempor incididunt ut labore et dolore magna aliqua.
       Ut enim ad minim veniam, quis nostrud exercitation 
       ullamco laboris nisi ut aliquip ex ea commodo 
       consequat. Duis aute irure dolor in reprehenderit in 
       voluptate velit esse cillum dolore eu fugiat nulla 
       pariatur. Excepteur sint occaecat cupidatat non 
       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
    }
  ]
}
