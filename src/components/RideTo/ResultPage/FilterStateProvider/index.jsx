import React, { useState } from 'react'

export const FilterProvider = React.createContext()

export function FilterStateProvider({ children }) {
  const [totalFiltersUsed, setTotalFiltersUsed] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState([])

  function handleFilterTotalUsed(count) {
    setTotalFiltersUsed(count)
  }

  function handleCheckBoxSelection(e) {
    const { id } = e.target
    setSelectedFilters(prev => {
      if (prev.includes(id)) {
        const clone = [...prev]
        clone.splice(prev.indexOf(id), 1)
        return clone
      } else {
        return [...prev, id]
      }
    })
  }

  return (
    <FilterProvider.Provider
      value={{
        totalFiltersUsed,
        handleFilterTotalUsed,
        handleCheckBoxSelection,
        selectedFilters
      }}>
      {children}
    </FilterProvider.Provider>
  )
}
