import { get } from 'services/api'

export const fetchBikes = async () => {
  const path = `bike-reviews/`
  const response = await get(path)

  return response
}

export const fetchBike = async id => {
  const path = `bike-reviews/${id}/`
  const response = await get(path)

  return response
}

export const SORT_OPTIONS = [
  { name: 'Reviews', id: 'reviews' },
  { name: 'Price (Low to High)', id: 'priceAsc' },
  { name: 'Price (High to Low)', id: 'priceDesc' },
  { name: 'Make (A-Z)', id: 'aToZ' }
]

export const CATEGORIES = ['engine', 'licence', 'brand', 'style']

export const DEFAULT_FILTERS = [
  {
    name: 'Brand',
    values: []
  },
  {
    name: 'Engine',
    values: []
  },
  {
    name: 'Style',
    values: []
  },
  {
    name: 'Budget',
    values: []
  },
  {
    name: 'Licence',
    values: []
  }
]

export const sortFunctions = {
  reviews: (a, b) => (a.score < b.score ? 1 : -1),
  priceAsc: (a, b) => (a.price > b.price ? 1 : -1),
  priceDesc: (a, b) => (a.price < b.price ? 1 : -1),
  aToZ: (a, b) => (a.brand > b.brand ? 1 : -1)
}

export function getFiltersCount(filters, budgetMin, budgetMax) {
  let count = Object.values(filters).reduce((count, values) => {
    return values === 'All' ? count : count + values.length
  }, 0)

  if (budgetMin || budgetMax) {
    ++count
  }

  return count
}

export function reduceFilters(filters) {
  return filters.reduce((obj, option) => {
    const name = option.name.toLowerCase()

    obj[name] = option.values
      .filter(value => value.active)
      .reduce((arr, value) => {
        arr.push(value.name)
        return arr
      }, [])

    if (obj[name].length === 0) {
      obj[name] = 'All'
    }

    return obj
  }, {})
}

export function mapBike(bike) {
  const mappedBike = {
    ...bike,
    price: parseInt(bike.price),
    name: bike.bike_model,
    images: bike.images.map(({ image }) => image),
    goodPoints: bike.good_points.map(({ good_point }) => good_point),
    badPoints: bike.bad_points.map(({ bad_point }) => bad_point),
    licence: bike.required_licence,
    requiredLicence: bike.required_licence,
    range: bike.miles_range,
    bookLink: `/test-ride?id=${bike.id}`,
    score: bike.rideto_score,
    insuranceGroup: bike.insurance_group,
    bodyContent: bike.content
  }

  return mappedBike
}
