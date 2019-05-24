export const SORT_OPTIONS = [
  { name: 'Reviews', id: 'reviews' },
  { name: 'Price (Low to High)', id: 'priceAsc' },
  { name: 'Price (High to Low)', id: 'priceDesc' },
  { name: 'Make (A-Z)', id: 'aToZ' }
]

export const sortFunctions = {
  reviews: (a, b) => (a.reviews < b.reviews ? 1 : -1),
  priceAsc: (a, b) => (a.price > b.price ? 1 : -1),
  priceDesc: (a, b) => (a.price < b.price ? 1 : -1),
  aToZ: (a, b) => (a.categories.brand > b.categories.brand ? 1 : -1)
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
