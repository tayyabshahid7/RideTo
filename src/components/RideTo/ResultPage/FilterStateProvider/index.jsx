import * as _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { parseQueryString } from 'services/api'
import { insertUrlParam, removeUrlParameter } from '../../../../services/page'

export const FilterProvider = React.createContext()

export function FilterStateProvider({ children }) {
  const [totalFiltersUsed, setTotalFiltersUsed] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState([])

  const options = [
    { value: 'distance', label: 'Distance' },
    { value: 'price', label: 'Price' },
    { value: 'date', label: 'Date' },
    { value: 'rating', label: 'Rating' }
  ]

  function handleFilterTotalUsed(count) {
    setTotalFiltersUsed(count)
  }

  useEffect(() => {
    const { filters } = parseQueryString(window.location.search.slice(1))

    if (filters) {
      const newFilters = filters.split(',')
      handleFilterTotalUsed(newFilters.length)
      setSelectedFilters(prev => {
        return [...prev, ...newFilters]
      })
    }
  }, [])

  function handleCheckBoxSelection(e) {
    const { id } = e.target
    setSelectedFilters(prev => {
      if (prev.includes(id)) {
        const clone = [...prev]
        clone.splice(prev.indexOf(id), 1)
        removeUrlParameter('filters')
        insertUrlParam('filters', clone)
        return clone
      } else {
        const f = [...prev, id]
        removeUrlParameter('filters')
        insertUrlParam('filters', f)
        return f
      }
    })
  }

  function handleFilter(courses, handleUpdateOption, sort) {
    const { available, unavailable } = courses

    const filtered = available.filter(el => {
      return selectedFilters.every(f => {
        return el[f] === true
      })
    })

    let newAvailable
    let newUnavailable
    let newFiltered
    let newSortBy

    const sortId = sort ? sort.value : null
    switch (sortId) {
      default:
        newAvailable = _.sortBy(available, 'distance_miles')
        newUnavailable = _.sortBy(unavailable, 'distance_miles')
        newFiltered = _.sortBy(filtered, 'distance_miles')
        newSortBy = options[0].value

        break
      case 'price':
        newAvailable = available.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })

        newUnavailable = unavailable.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })

        newFiltered = filtered.sort((a, b) => {
          if (a.price === b.price) {
            return a.distance_miles - b.distance_miles
          }
          return a.price > b.price ? 1 : -1
        })
        newSortBy = options[1].value

        break

      case 'date':
        newAvailable = available.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })

        newUnavailable = unavailable.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })

        newFiltered = filtered.sort((a, b) => {
          if (a.next_date_available === b.next_date_available) {
            return a.distance_miles - b.distance_miles
          }
          return a.next_date_available > b.next_date_available ? 1 : -1
        })
        newSortBy = options[2].value

        break

      case 'rating':
        newAvailable = available.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        newUnavailable = unavailable.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        newFiltered = filtered.sort((a, b) => {
          if (a.rating === b.rating) {
            return a.distance_miles - b.distance_miles
          }
          return a.rating > b.rating ? -1 : 1
        })
        newSortBy = options[3].value
        break
    }

    handleFilterTotalUsed(selectedFilters.length)
    handleUpdateOption({
      courses: {
        available: newAvailable,
        unavailable: newUnavailable,
        filtered: newFiltered
      },
      sortByModal: newSortBy
    })
  }

  return (
    <FilterProvider.Provider
      value={{
        totalFiltersUsed,
        handleFilterTotalUsed,
        handleCheckBoxSelection,
        selectedFilters,
        handleFilter,
        options
      }}>
      {children}
    </FilterProvider.Provider>
  )
}
