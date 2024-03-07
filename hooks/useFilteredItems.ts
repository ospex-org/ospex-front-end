import { useContext, useMemo } from 'react'
import { contest } from '../constants/interface'
import { ProviderContext } from '../contexts/ProviderContext'

// Use a generic type parameter T to allow this hook to work with any type of item
export const useFilteredItems = <T>(
  query: string,
  items: T[],
  filterCriteria: (item: T, query: string, contests: contest[]) => boolean
) => {
  const { contests } = useContext(ProviderContext)

  const filteredItems = useMemo(() => {
    // Ensure that items and contests are properly typed
    return items.filter(item => filterCriteria(item, query, contests))
  }, [items, query, contests, filterCriteria])

  return filteredItems
}