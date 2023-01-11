import React from 'react'

export const FilterProvider = React.createContext()

export function FilterStateProvider({ children }) {
  return (
    <FilterProvider.Provider value={{}}>{children}</FilterProvider.Provider>
  )
}
